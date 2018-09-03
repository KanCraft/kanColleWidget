import DMM from "../Applications/Context/DMM";

declare interface App {
  init(): any;
}

((scope: Window) => {
  const app: App = new DMM(scope);
  scope.onload = () => app.init();
})(window);
