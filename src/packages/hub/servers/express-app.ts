/*
The main hub express app.
*/

import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import ms from "ms";
import { parse as parseURL } from "url";
import { join } from "path";

import { initAnalytics } from "../analytics";
import { getLogger } from "../logger";
import { setup_health_checks as setupHealthChecks } from "../health-checks";
import { path as STATIC_PATH } from "@cocalc/static";
import { path as WEBAPP_PATH } from "@cocalc/assets";
import { path as CDN_PATH } from "@cocalc/cdn";
import { database } from "./database";
import basePath from "@cocalc/util-node/base-path";
import initMetrics from "./app/metrics";
import initAPI from "./app/api";
import initBlobs from "./app/blobs";
import initSetCookies from "./app/set-cookies";
import initCustomize from "./app/customize";
import initStats from "./app/stats";
import initAppRedirect from "./app/app-redirect";
import initLanding from "./app/landing";
import initShareNext from "./app/share";
import vhostShare from "@cocalc/next/lib/share/virtual-hosts";

// Used for longterm caching of files
const MAX_AGE = ms("10 days");
const SHORT_AGE = ms("10 seconds");

interface Options {
  projectControl;
  isPersonal: boolean;
  landingServer: boolean;
  shareServer: boolean;
}

export default async function init(opts: Options): Promise<{
  app: express.Application;
  router: express.Router;
}> {
  const winston = getLogger("express-app");
  winston.info("creating express app");

  // Create an express application
  const app = express();
  const router = express.Router();

  // This must go very early - we handle virtual hosts, like wstein.org
  // before any other routes or middleware interfere.
  if (opts.shareServer) {
    app.use(vhostShare());
  }

  // Enable compression, as suggested by
  //   http://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression
  // NOTE "Express runs everything in order" --
  // https://github.com/expressjs/compression/issues/35#issuecomment-77076170
  app.use(compression());

  app.use(cookieParser());

  // Install custom middleware to track response time metrics via prometheus, and
  // also serve them up at /metrics.
  initMetrics(router);

  // see http://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
  app.enable("trust proxy");

  // Various files such as the webpack static content should be cached long-term,
  // and we use this function to set appropriate headers at various points below.
  const cacheLongTerm = (res) => {
    res.setHeader("Cache-Control", `public, max-age='${MAX_AGE}'`);
    res.setHeader(
      "Expires",
      new Date(Date.now().valueOf() + MAX_AGE).toUTCString()
    );
  };

  const cacheShortTerm = (res) => {
    res.setHeader("Cache-Control", `public, max-age='${SHORT_AGE}'`);
    res.setHeader(
      "Expires",
      new Date(Date.now().valueOf() + SHORT_AGE).toUTCString()
    );
  };

  // robots.txt: disable everything except /share.  In particular, don't allow
  // indexing for published subdirectories to avoid a lot of 500/404 errors.
  router.use("/robots.txt", (_req, res) => {
    res.header("Content-Type", "text/plain");
    res.header("Cache-Control", "private, no-cache, must-revalidate");
    res.write(`User-agent: *
               Allow: /share
               Disallow: /*
               `);
    res.end();
  });

  // setup the analytics.js endpoint
  await initAnalytics(router, database);

  // setup all healthcheck endpoints
  await setupHealthChecks({ router, db: database });

  if (opts.landingServer) {
    // Landing page content: this is the "/" index page + assets, for docker, on-prem, dev.
    await initLanding(app);
  }

  if (opts.shareServer) {
    // Landing page content: this is the "/" index page + assets, for docker, on-prem, dev.
    await initShareNext(app);
  }

  // The /static content, used by docker, development, etc.
  // This is the stuff that's packaged up via webpack in packages/static.
  router.use(
    join("/static", STATIC_PATH, "app.html"),
    express.static(join(STATIC_PATH, "app.html"), {
      setHeaders: cacheShortTerm,
    })
  );
  router.use(
    "/static",
    express.static(STATIC_PATH, { setHeaders: cacheLongTerm })
  );

  // Static assets that are used by the webapp, the landing page, etc.
  router.use(
    "/webapp",
    express.static(WEBAPP_PATH, { setHeaders: cacheLongTerm })
  );

  // This is @cocalc/cdn – cocalc serves everything it might get from a CDN on its own.
  // This is defined in the @cocalc/cdn package.  See the comments in packages/cdn.
  router.use("/cdn", express.static(CDN_PATH, { setHeaders: cacheLongTerm }));

  // Redirect requests to /app to /static/app.html.
  // TODO: this will likely go away when rewrite the landing pages to not
  // redirect users to /app in the first place.
  router.get("/app", (req, res) => {
    // query is exactly "?key=value,key=..."
    const query = parseURL(req.url, true).search || "";
    res.redirect(join(basePath, "static/app.html") + query);
  });

  initAPI(router, opts.projectControl);
  initBlobs(router);
  initSetCookies(router);
  initCustomize(router, opts.isPersonal);
  initStats(router);
  initAppRedirect(router);

  if (basePath !== "/") {
    app.use(basePath, router);
  } else {
    app.use(router);
  }

  return { app, router };
}
