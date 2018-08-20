import {Router} from "chomex";
import * as Controllers from "../Controllers/NotificationClickControllers";

let router = new Router(id => {
  const [name, ] = id.split(".");
  return {name};
});

router.on("mission",    Controllers.OnMissionNotificationClicked);
router.on("recovery",   Controllers.OnRecoveryNotificationClicked);
router.on("createship", Controllers.OnCreateshipNotificationClicked);
router.on("tiredness",  Controllers.OnTirednessNotificationClicked);
router.on("debug",      Controllers.OnDebugNotificationClicked);
router.on("strict-mission-warning", Controllers.OnStrictMissionWarningClicked);

// TODO: どっかやる。chrome直接参照すんな。
router.on("aprilfools", id => {
  // めんどいのでwindowを参照します
  window.open("https://otiai10.github.io/kanColleWidget/gh-pages/aprilfools/");
// TODO: どっかやる。chrome直接参照すんな。
  chrome.notifications.clear(id);
});

const NotificationClickListener = router.listener();
export default NotificationClickListener;
