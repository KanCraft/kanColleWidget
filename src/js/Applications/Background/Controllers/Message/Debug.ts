/**
 * 設定画面の「Dev Debugger」で呼ばれるやつ
 */

import * as CaptureController from "./Capture";
import * as WindowController from "./Window";

export async function DebugController(message: any) {
  const dictionary = {
    ...WindowController,
    ...CaptureController,
  };
  const controller = message.__controller;
  const scope = message.__this;
  return dictionary[controller].bind(scope)(message);
}
