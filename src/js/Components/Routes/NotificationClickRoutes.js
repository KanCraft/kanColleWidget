import {Router} from 'chomex';
import * as Controllers from '../Controllers/NotificationClickControllers';

let router = new Router();
router.on('xxx', Controllers.OnMissionNotificationClicked);

const NotificationClickListener = router.listener();
export default NotificationClickListener;
