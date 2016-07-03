import {SerialRouter} from 'chomex';
import * as Controllers from '../Controllers/RequestControllers';

let router = new SerialRouter(4);
router.on([
  {url: /api_get_member\/material/},
  {url: /api_get_member\/kdock/},
  {url: /api_req_kousyou\/createship/}
], Controllers.onCreateShipCompleted);
router.on([{url: /api_req_mission\/start/}], Controllers.onMissionStart);
router.on([{url: /api_get_member\/mapinfo/}], Controllers.onMapPrepare);
router.on([{url: /api_req_kaisou\/powerup/}], Controllers.onKaisouPowerup);

const WebRequestListener = router.listener();
export default WebRequestListener;
