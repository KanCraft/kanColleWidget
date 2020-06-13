import DMM from "../Applications/Context/DMM";

declare interface App {
  init(): any;
  onresize(): any;
  onbeforeunload(ev: Event): any;
  listener(): (message: any) => any;
  interval(): () => any;
}

((scope: Window) => {
  const app: App = new DMM(scope);
  scope.onload = () => app.init();
  scope.onresize = () => app.onresize();
  scope.onbeforeunload = (ev: Event) => app.onbeforeunload(ev);
  chrome.runtime.onMessage.addListener(app.listener());
  setInterval(app.interval(), 20 * 1000);
})(window);
