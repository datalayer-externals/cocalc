/*
 *  This file is part of CoCalc: Copyright © 2022 Sagemath, Inc.
 *  License: AGPLv3 s.t. "Commons Clause" – see LICENSE.md for details
 */

import { Icon } from "@cocalc/frontend/components/icon";
import { Paragraph, Text } from "components/misc";
import A from "components/misc/A";
import SiteName from "components/share/site-name";
import {
  OverviewRow,
  OVERVIEW_LARGE_ICON,
  OVERVIEW_STYLE,
  Product,
} from "lib/styles/layouts";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Overview() {
  const router = useRouter();

  // most likely, user will go to the cart next
  useEffect(() => {
    router.prefetch("/store/site-license");
  }, []);

  return (
    <div style={OVERVIEW_STYLE}>
      <Icon style={OVERVIEW_LARGE_ICON} name="shopping-cart" />
      <h2 style={{ marginBottom: "30px" }}>
        Welcome to the <SiteName /> Store!
      </h2>
      <div style={{ fontSize: "13pt" }}>
        Shop below, explore an{" "}
        <A href="/pricing">overview of products and pricing</A>, or{" "}
        <A href="/vouchers">explore vouchers</A>.
      </div>
      <OverviewRow>
        <Product icon="key" title="License" href="/store/site-license">
          Buy a license to upgrade projects, remove the warning banner, get
          internet access, more CPU and memory, etc.
        </Product>
        <Product icon="rocket" title="License Booster" href="/store/boost">
          Add additional upgrades to an existing and <em>compatible</em>{" "}
          license.
        </Product>
        <Product
          href={"/store/dedicated"}
          icon="save"
          icon2="dedicated"
          title="Dedicated Disk/VM"
        >
          Attach a large dedicated disk for more storage to your project or run
          your project on a dedicated Virtual Machine to harness much more CPU
          and memory.
        </Product>
        <Product href={"/pricing/onprem"} icon="server" title="On-Premises">
          Run CoCalc on your own machine or cluster in order to keep your data
          on-site and use compute resources that you already have.
        </Product>
      </OverviewRow>
      <Paragraph style={{ marginTop: "4em" }}>
        If you already selected one or more items, view your{" "}
        <A href="/store/cart">shopping cart</A> or go straight to{" "}
        <A href="/store/checkout">checkout</A>.
      </Paragraph>
      <Paragraph>
        You can also browse your <A href="/billing">billing records</A> or{" "}
        <A href="/licenses">licenses</A>.
      </Paragraph>
    </div>
  );
}
