/**
 * このスクリプトは大破進撃防止窓のためだけに使う
 * embedタグのonclickをとらなきゃいけないので、all_frames:trueでosapi.dmm.comで有効
 */
import {Router, Client} from "chomex";
import DamageSnapshotDisplay from "../../Application/Routine/DamageSnapshot";

const _setupContentPageRouter = (client) => {
  const snapshot = new DamageSnapshotDisplay(client);
  let router = new Router();
  router.on("/snapshot/show", (message) => snapshot.show(message.uri));
  router.on("/snapshot/hide", () => snapshot.remove());
  router.on("/snapshot/prepare", () => snapshot.prepare());

  // 出撃中海域情報表示
  router.on("/area/update", message => {
    console.log("/area/update", message);
    // TODO: ここはiframeの中なので、document.titleが直接いじれないっぽい
    // TODO: windowを渡して管理するクラスか、このスクリプト自体をdmm.jsに移植するしかない気がする
    // document.title = message.title;
    // parent.document.title = message.title;
    // debugger;
  });

  chrome.runtime.onMessage.addListener(router.listener());
};

const init = () => {
  const KANCOLLE_DMM_APP_ID = "854854";
  const url = new URL(window.location.href);
  if (url.searchParams.get("aid") != KANCOLLE_DMM_APP_ID) return "Do Nothing";
  const client = new Client(chrome.runtime);
  client.message("/window/should-decorate").then(() => _setupContentPageRouter(client));
};

setTimeout(() => init(), 100);
