/**
 * 設定画面の「Dev Debugger」で呼ばれるやつ
 */

import * as CaptureController from "./Capture";
import * as DSnapshotController from "./DamageSnapshot";
import * as WindowController from "./Window";

import * as OnBeforeRequest from "../onBeforeRequest";

export async function DebugController(message: any) {
  const dictionary = {
    ...WindowController,
    ...CaptureController,
    ...DSnapshotController,
    ...OnBeforeRequest,
  };
  const controller = message.__controller;
  const scope = message.__this;
  return dictionary[controller].bind(scope)(message);
}
