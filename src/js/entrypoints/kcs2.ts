import Kcs2 from "../Applications/Context/Kcs2";

((scope) => {
  const app = new Kcs2(scope);
  scope.onload = () => app.init();
  chrome.runtime.onMessage.addListener(app.listener());
})(window);
