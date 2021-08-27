import Link from "next/link";
import SquareLogo from "./logo-square";
import A from "components/misc/A";
import { join } from "path";
import { Layout } from "antd";
import useCustomize from "lib/use-customize";
import { appBasePath, basePath } from "lib/base-path";

const GAP = "32px";

const LinkStyle = {
  color: "white",
  marginRight: GAP,
  display: "inline-block",
};

export default function Header() {
  const { anonymousSignup, dns, helpEmail, siteName, termsOfServiceURL } =
    useCustomize();
  const appURL = dns
    ? `https://${dns}/static/app.html`
    : join(basePath, "static/app.html");
  return (
    <Layout.Header
      style={{
        minHeight: "64px",
        height: "auto",
        lineHeight: "32px",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <Link href={"/"}>
        <a>
          <SquareLogo style={{ height: "40px", marginRight: GAP }} />
        </a>
      </Link>
      {anonymousSignup && (
        <A
          style={LinkStyle}
          href={`${appURL}?anonymous=jupyter`}
          title={`Try ${siteName} immediately without creating an account.`}
        >
          Try {siteName}
        </A>
      )}{" "}
      <Link href="/share/public_paths/page/1">
        <a style={LinkStyle} title="View files that people have published.">
          Published Files
        </a>
      </Link>
      {" "}
      {termsOfServiceURL && (
        <A
          style={LinkStyle}
          href={termsOfServiceURL}
          title="View the terms of service and other legal documents."
        >
          Legal
        </A>
      )}
      {helpEmail && (
        <A
          style={LinkStyle}
          href={`mailto:${helpEmail}`}
          title={`Ask us a question via email to ${helpEmail}.`}
        >
          Email Help
        </A>
      )}
      <A
        style={LinkStyle}
        href="https://doc.cocalc.com"
        title="View the CoCalc documenation."
      >
        Documentation
      </A>
      <A
        style={LinkStyle}
        href={appURL}
        title={`Sign in to ${siteName} or create an account.`}
      >
        Sign In
      </A>
    </Layout.Header>
  );
}
