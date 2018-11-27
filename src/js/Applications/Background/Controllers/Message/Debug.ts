/**
 * 設定画面の「Dev Debugger」で呼ばれるやつ
 */
import Message from "../Message";
import Request from "../Request";

export async function DebugController(message: any) {
  const dictionary = {
    ...Message,
    ...Request,
  };
  const controller = dictionary[message.__controller];
  const scope = message.__this;
  return controller.call(scope, message);
}

export function DebugAvailables() {
  return {
    controllers: {
      message: [...Object.keys(Message)],
      request: [...Object.keys(Request)],
    },
  };
}
