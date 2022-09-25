/*
 *  This file is part of CoCalc: Copyright © 2022 Sagemath, Inc.
 *  License: AGPLv3 s.t. "Commons Clause" – see LICENSE.md for details
 */

import { Icon } from "@cocalc/frontend/components/icon";
import { Alert, Button, Popconfirm } from "antd";
import { NextRouter } from "next/router";
import { useLicenseProject } from "./util";

export const ApplyLicenseToProject: React.FC<{ router: NextRouter }> = ({
  router,
}) => {
  const { upgradeProjectId, upgradeProjectDelete } = useLicenseProject(router);

  function body(): JSX.Element {
    if (!upgradeProjectId) throw new Error("should never happen");
    return (
      <div>
        After purchase, this license will applied to project{" "}
        <code>{upgradeProjectId}</code> automatically.
      </div>
    );
  }

  if (!upgradeProjectId) return null;

  return (
    <Alert
      type="info"
      message={body()}
      style={{ marginBottom: "20px" }}
      action={
        <Popconfirm
          placement="bottomRight"
          title={
            <div style={{ maxWidth: "400px" }}>
              Are you sure you want to cancel automatically applying the license
              to the project after purchasing it? You'll have to apply the
              license manually later.
            </div>
          }
          onConfirm={upgradeProjectDelete}
          okText="Yes, cancel"
          cancelText="No"
        >
          <Button size="small" type="link">
            <Icon name="times" />
          </Button>
        </Popconfirm>
      }
    />
  );
};
