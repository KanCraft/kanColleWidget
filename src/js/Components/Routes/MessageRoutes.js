import {Router} from "chomex";
import * as Controllers from "../Controllers/MessageControllers";

let router = new Router();
router.on("/config/get",             Controllers.GetConfig);
router.on("/config/set",             Controllers.SetConfig);
router.on("/window/open",            Controllers.OpenWindow);
router.on("/window/dashboard",       Controllers.OpenDashboard);
router.on("/window/should-decorate", Controllers.ShouldDecorateWindow);
router.on("/window/capture",         Controllers.CaptureWindow);
router.on("/window/zoom:set",        Controllers.ZoomWindow);
router.on("/window/current-action",  Controllers.CurrentActionForWindow);
router.on("/frame/all",              Controllers.GetAllFrames);
router.on("/frame/new",              Controllers.SaveNewFrame);
router.on("/frame/update",           Controllers.UpdateFrame);
router.on("/frame/delete",           Controllers.DeleteFrame);
router.on("/snapshot/take",          Controllers.TakeDamageSnapshot);
router.on("/queues/get",             Controllers.GetQueues);
router.on("/twitter/profile",        Controllers.TwitterProfile);
router.on("/twitter/auth",           Controllers.TwitterAuth);
router.on("/twitter/post_with_image",Controllers.TwitterPostWithImage);
router.on("/launchposition/:update", Controllers.UpdateLaunchPosition);
router.on("/debug/imagerecognize",   Controllers.ImageRecognizationDebug);

const MessageListener = router.listener();
export default MessageListener;
