import {Router} from "chomex";
import WindowService from "../../Services/WindowService";

// TODO: どっかやる
import Config from "../Models/Config";

let router = new Router(id => {
  let [name, ] = id.split(".");
  if (id.match(/failed$/)) name += ".failed";
  return {name};
});

router.on("mission", (id) => {
  chrome.notifications.clear(id);
  window.open("https://github.com/otiai10/kanColleWidget/wiki/遠征IDが知らない子と言われたとき");
});

router.on("recovery.failed", id => {
  chrome.notifications.clear(id);
  const [,dock,] = id.split(".");
  WindowService.getInstance().openManualWindow("recovery", dock);
});

router.on("aprilfools", (id, index) => {

  const url = "https://otiai10.github.io/kanColleWidget/gh-pages/aprilfools";
  if (index == 0) return window.open(url);

  // それ以外はもう通知出すのやめる
  const now = new Date();
  return Config.find("aprilfools").update({year: now.getFullYear()});
});

const NotificationButtonClickListener = router.listener();
export default NotificationButtonClickListener;
