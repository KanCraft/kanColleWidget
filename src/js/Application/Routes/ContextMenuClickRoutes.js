import {Router} from "chomex";

// {{{ FIXME: とりあえずContextMenuは一種類しかないので、_allでぜんぶ受けましょう
import {OnAllContextClicked} from "../Controllers/CtxMenuClickControllers";
const resolve = (/* info, tab */) => ({name:"_all"});
let router = new Router(resolve);
router.on("_all", OnAllContextClicked);
// }}}

export default router.listener();

export const createProperties = {
  title:    "動画キャプチャ",
  contexts: ["all"],
  documentUrlPatterns: [
    "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
    "http://osapi.dmm.com/gadgets/ifr*"
  ]
};
