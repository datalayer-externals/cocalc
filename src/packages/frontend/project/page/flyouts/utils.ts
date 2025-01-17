/*
 *  This file is part of CoCalc: Copyright © 2023 Sagemath, Inc.
 *  License: AGPLv3 s.t. "Commons Clause" – see LICENSE.md for details
 */

import { CSS } from "@cocalc/frontend/app-framework";
import { getRandomColor } from "@cocalc/util/misc";
import { COLORS } from "@cocalc/util/theme";
import { fileItemLeftBorder } from "./file-list-item";
import { FlyoutActiveMode, FlyoutLogMode } from "./state";

export const FLYOUT_LOG_DEFAULT_MODE: FlyoutLogMode = "files";

export const FLYOUT_ACTIVE_DEFAULT_MODE: FlyoutActiveMode = "tabs";

export const GROUP_STYLE: CSS = {
  fontWeight: "bold",
  marginTop: "5px",
} as const;

export function deterministicColor(group: string) {
  return group === ""
    ? COLORS.GRAY_L
    : getRandomColor(group, { diff: 30, min: 185, max: 245 });
}

export function randomLeftBorder(group: string): CSS {
  const col = deterministicColor(group);
  return fileItemLeftBorder(col);
}
