import {
  onCreateShipCompleted
} from './Kousho';

import {
  onMissionStart
} from './Mission';

import {
  onMapPrepare
} from './Map';

import {
  onKaisouPowerup,
} from './Kaisou';

const RequestControllers = {
  onKoushoCreateShipCompleted: onCreateShipCompleted,
  onMissionStart,
  onMapPrepare,
  onKaisouPowerup,
}

module.exports = RequestControllers;
