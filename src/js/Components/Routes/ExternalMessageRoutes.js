import {Router} from "chomex";
import * as Controllers from "../Controllers/ExternalMessageControllers";

const resolve = message => { return {name:message.act || message.path}; };
let router = new Router(resolve);

router.on("/api/subscribe", Controllers.SubscribeStart);
export default router.listener();
