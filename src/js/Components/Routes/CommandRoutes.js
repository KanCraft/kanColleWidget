import {Router} from "chomex";
import * as Controllers from "../Controllers/CommandControllers";

const resolve = (name) => {
    return {name};
};

let router = new Router(resolve);
router.on("capture", Controllers.CaptureController);

const CommandRouter = router.listener();
export default CommandRouter;
