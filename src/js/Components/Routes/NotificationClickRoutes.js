import {Router} from "chomex";
import * as Controllers from "../Controllers/NotificationClickControllers";

let router = new Router(id => {
    const [name, ] = id.split(".");
    return {name};
});

router.on("mission", Controllers.OnMissionNotificationClicked);

const NotificationClickListener = router.listener();
export default NotificationClickListener;
