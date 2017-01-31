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

const NotificationClickListener = router.listener();
export default NotificationClickListener;
