/*
This is a component that should be placed at the top of a document to help
the user when they have requested their document run on a given compute
server.  It does the following:

- If id is as requested and is the project, do nothing.

- If id is as requested and is not the project, draw line in color of that compute server.

- If not where we want to be, defines how close:

  - 5%: compute server doesn't exist or is off and not owned by you
  - 10%: compute server is off
  - 25%: any status that isn't starting/running
  - 40%: compute server is starting
  - 55%: compute server is running
  - 65%: ...
  - 80%: compute server is running and detailed state has compute image running

- If compute server not running:
    - if exists and you own it, prompts user to start it and also shows the
      compute server's component so they can do so.
    - if not exists (or deleted), say so
    - if owned by somebody else, say so
*/

import Inline from "./inline";
import { useTypedRedux } from "@cocalc/frontend/app-framework";
import { Alert, Button, Progress, Space, Spin, Tooltip } from "antd";
import type { ComputeServerUserInfo } from "@cocalc/util/db-schema/compute-servers";
import ComputeServer from "./compute-server";
import { useEffect, useState } from "react";
import { Icon } from "@cocalc/frontend/components";

export default function ComputeServerTransition({
  project_id,
  id,
  requestedId,
}) {
  const [showDetails, setShowDetails] = useState<boolean | null>(null);
  const computeServers = useTypedRedux({ project_id }, "compute_servers");
  const account_id = useTypedRedux("account", "account_id");

  useEffect(() => {
    // if the id or requestedId changes, need to reset to default behavior
    // regarding what is shown.
    setShowDetails(null);
  }, [id, requestedId]);

  if (id == 0 && requestedId == 0) {
    return null;
  }

  const topBar = (progress) => (
    <Tooltip
      mouseEnterDelay={0.9}
      title={
        <>
          {progress == 100 ? "Running on " : "Moving to "}{" "}
          <Inline id={requestedId} />. Click for details.
        </>
      }
    >
      <div onClick={() => setShowDetails(showDetails === true ? false : true)}>
        <div style={{ marginRight: "5px" }}>
          <Inline
            colorOnly
            id={requestedId}
            style={{
              borderRadius: "5px",
              height: "10px",
              cursor: "pointer",
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </Tooltip>
  );

  if (id == requestedId && !showDetails) {
    return topBar(100);
  }

  const server: ComputeServerUserInfo | undefined = computeServers
    .get(`${requestedId}`)
    ?.toJS();
  const { progress, message, status } = getProgress(
    server,
    account_id,
    id,
    requestedId,
  );
  if (showDetails != null && !showDetails) {
    return topBar(progress);
  }

  return (
    <div
      style={{
        border: `1px solid ${server?.color}`,
        borderRadius: "5px",
        marginBottom: "5px",
        marginRight: "5px",
      }}
    >
      <div style={{ marginBottom: "15px" }}>{topBar(progress)}</div>
      <div style={{ textAlign: "center" }}>
        <Space style={{ width: "100%", margin: "0 15px" }}>
          <Button
            size="large"
            style={{ color: "#666" }}
            type="text"
            onClick={() => setShowDetails(false)}
          >
            <Icon name="times" /> Hide
          </Button>
          <Alert
            showIcon
            type="info"
            message={
              <>
                {message}{" "}
                {progress < 100 && status != "exception" ? (
                  <Spin style={{ marginLeft: "15px" }} />
                ) : undefined}
              </>
            }
            style={{ margin: "0 15px" }}
          />
          <Progress
            type="circle"
            trailColor="#e6f4ff"
            percent={progress}
            strokeWidth={14}
            size={42}
          />
        </Space>
      </div>
      {server != null && (
        <div style={{ margin: "15px" }}>
          <ComputeServer
            editable={account_id == server.account_id}
            {...server}
          />
        </div>
      )}
    </div>
  );
}

function getProgress(
  server: ComputeServerUserInfo | undefined,
  account_id,
  id,
  requestedId,
): {
  progress: number;
  message: string;
  status: "exception" | "active" | "normal" | "success";
} {
  if (requestedId == 0) {
    return {
      progress: 50,
      message: "Moving back to project...",
      status: "active",
    };
  }
  if (id == requestedId) {
    return {
      progress: 100,
      message: "Compute server is connected!",
      status: "success",
    };
  }
  if (server == null) {
    return {
      progress: 0,
      message: "Server does not exist.  Please select a different server.",
      status: "exception",
    };
  }
  if (server.deleted) {
    return {
      progress: 0,
      message:
        "Server was deleted.  Please select a different server or undelete it.",
      status: "exception",
    };
  }

  if (server.account_id != account_id && server.state != "running") {
    return {
      progress: 0,
      message:
        "This is not your compute server, and it is not running. Only the owner of a compute server can start it.",
      status: "exception",
    };
  }

  if (server.state == "off") {
    return {
      progress: 10,
      message:
        "Please start the compute server by clicking the Start button below.",
      status: "exception",
    };
  }

  if (server.state != "starting" && server.state != "running") {
    return {
      progress: 25,
      message: "Please start the compute server.",
      status: "exception",
    };
  }

  if (server.state == "starting") {
    return {
      progress: 40,
      message: "Compute server is starting.",
      status: "active",
    };
  }

  // below it is running
  if (server.detailed_state?.compute?.state == "ready") {
    if (isRecent(server.detailed_state?.compute?.time)) {
      return {
        progress: 80,
        message: "Waiting for compute server to connect.",
        status: "normal",
      };
    }
  }

  if (server.detailed_state?.["filesystem-sync"]?.state == "ready") {
    if (isRecent(server.detailed_state?.["filesystem-sync"]?.time)) {
      return {
        progress: 65,
        message: "Waiting for compute server to fully boot up.",
        status: "active",
      };
    }
  }

  return {
    progress: 50,
    message: "Waiting for compute server to finish booting up.",
    status: "active",
  };
}

function isRecent(expire = 0) {
  return Date.now() - expire < 60 * 1000;
}