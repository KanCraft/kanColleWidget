import DMM from "../Applications/Context/DMM";

declare interface App {
  init(): any;
  listener(): (message: any) => any;
}

((scope: Window) => {
  const app: App = new DMM(scope);
  chrome.runtime.onMessage.addListener(app.listener());
  scope.onload = () => app.init();
})(window);
