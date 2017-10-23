/**
 * content_scriptのmainの定義
 * FRAME_SHIFT（dmm.comドメイン）の場合でもEXTRACT（osapi.dmm.comドメイン）の場合でも
 * 共通の処理を定義する部分。
 * 共通ではない処理は、entrypoints/dmm.jsあるいはentrypoints/osapi.dmm.jsに定義すべき。
 */
import LaunchPositionRecorder from "../../Application/Routine/LaunchPositionRecorder";
import InAppActionButtons     from "../../Application/Routine/InAppActionButtons";
import {Router} from "chomex";

export default class Main {
  constructor(context, client, decorator) {
    this.context   = context;
    this.client    = client;
    this.decorator = decorator;
    this.router    = new Router();
  }
  main() {
    return Promise.all([
      this._decorate(),
      this._setup_OnBeforeUnload(),
      this._setup_Intervals(),
      this._setup_InAppActionButtons(),
      this._exec_once(),
    ]).then(() => {
      chrome.runtime.onMessage.addListener(this.router.listener());
    });
  }

  _decorate() {
    this.decorator.decorate();
    return Promise.resolve();
  }

  _setup_OnBeforeUnload() {
    // onbeforeunloadで必ずbackgroundを叩くが、ダイアログは出さない
    let funcs = [() => this.client.message("/window/event/onclose") && false];
    this.client.message("/config/get", {key:"alert-on-before-unload"}).then(({data}) => {
      // ダイアログ出す設定がonなら、出すようにします
      if (data.value) funcs.push(() => true);
    });
    // ひとつでもtrueを返すものがあればダイアログを出すようにする
    this.context.onbeforeunload = () => funcs.some(f => f()) ? true : null;
    return Promise.resolve();
  }
  _setup_Intervals() {
    const recorder = new LaunchPositionRecorder(this.client);
    recorder.mainGameWindow(60 * 1000);
    return Promise.resolve();
  }
  _setup_InAppActionButtons() {
    return new Promise(resolve => {
      this.client.message("/config/get", {key: "use-inapp-action-buttons"}).then(({data}) => {
        if (!data.value) return resolve();
        this.client.message("/window/self", ({self}) => {
          const inAppActionButtons = new InAppActionButtons(this.client);
          const buttons = inAppActionButtons.setContext(self).html();
          document.body.appendChild(buttons);
          this.router.on("/mute/changed", ({muted}) => inAppActionButtons.muteChanged(muted));
          resolve();
        });
      });
    });
  }
  _exec_once() {
    this.client.message("/sync/load", {context:"auto"});
    return Promise.resolve();
  }
}
