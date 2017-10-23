import {Router} from "chomex";
import WindowService from "../../Services/WindowService";

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

const NotificationButtonClickListener = router.listener();
export default NotificationButtonClickListener;
