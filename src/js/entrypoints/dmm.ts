import DMM from "../Applications/Context/DMM";

declare interface App {
  init(): any;
  onresize(): any;
  listener(): (message: any) => any;
  interval(): () => any;
}

((scope: Window) => {
  const app: App = new DMM(scope);
  scope.onload = () => app.init();
  scope.onresize = () => app.onresize();
  chrome.runtime.onMessage.addListener(app.listener());
  setInterval(app.interval(), 20 * 1000);
})(window);
