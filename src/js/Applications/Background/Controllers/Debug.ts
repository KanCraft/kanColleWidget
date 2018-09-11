/**
 * 設定画面の「Dev Debugger」で呼ばれるやつ
 */

import * as WindowController from "./Window";

export async function DebugController(message: any) {
  const dictionary = {
    ...WindowController,
  };
  const controller = message.__controller;
  const scope = message.__this;
  return dictionary[controller].bind(scope)(message);
}
