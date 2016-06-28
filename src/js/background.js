import { Router, SerialRouter, Logger } from 'chomex';
import {
  GetConfig,
  SetConfig,
  OpenWindow,
  ShouldDecorateWindow,
} from './Components/Controllers/MessageControllers';
import * as Req from './Components/Controllers/RequestControllers';

import QueueObserver from './Components/Routine/QueueObserver';

// {{ debug
import {Mission} from './Components/Models/Queue/Queue';
// QueueObserver.getInstance().run();
QueueObserver.getInstance().accessor.append('missions', Mission.createFromFormData({
  api_deck_id: ['2'],
  api_mission_id: ['-1']
}))
// }}
QueueObserver.start();

const logger = (() => { return new Logger(); })();

// Message Router
let router = new Router(logger);
router.on('/config/get', GetConfig);
router.on('/config/set', SetConfig);
router.on('/window/open', OpenWindow);
router.on('/window/should-decorate', ShouldDecorateWindow);
chrome.runtime.onMessage.addListener(router.listener());

// Web Request Router
let reqrouter = new SerialRouter(4, logger);
reqrouter.on([
  {url: /api_get_member\/material/},
  {url: /api_get_member\/kdock/},
  {url: /api_req_kousyou\/createship/}
], Req.onCreateShipCompleted);
reqrouter.on([{url: /api_req_mission\/start/}], Req.onMissionStart);
reqrouter.on([{url: /api_get_member\/mapinfo/}], Req.onMapPrepare);
reqrouter.on([{url: /api_req_kaisou\/powerup/}], Req.onKaisouPowerup);

chrome.webRequest.onBeforeRequest.addListener(
  reqrouter.listener(),
  {'urls':["*://*/kcsapi/*"]},
  ['requestBody']
);
