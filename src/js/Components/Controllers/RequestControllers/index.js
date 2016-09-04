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

import {
  onBattleResulted,
} from './Battle'

const RequestControllers = {
  onKoushoCreateShipCompleted: onCreateShipCompleted,
  onBattleResulted,
  onMissionStart,
  onMapPrepare,
  onKaisouPowerup,
}

module.exports = RequestControllers;
