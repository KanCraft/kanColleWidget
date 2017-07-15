/**
 * content_scriptのmainの定義
 */
import LaunchPositionRecorder from "../../Components/Routine/LaunchPositionRecorder";
import InAppActionButtons from "../../Components/Routine/InAppActionButtons";
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
    let funcs = [];
    const saveBeforeUnload = () => { this.client.message("/sync/save"); return false; };
    funcs.push(saveBeforeUnload);
    this.client.message("/config/get", {key:"alert-on-before-unload"}).then(({data}) => {
      if (data.value) funcs.push(() => true);
    });
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
