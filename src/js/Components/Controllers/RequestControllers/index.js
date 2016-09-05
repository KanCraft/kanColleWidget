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

import {
  onRecoveryStart,
  onRecoveryStartCompleted,
} from './Recovery';

const RequestControllers = {
  onKoushoCreateShipCompleted: onCreateShipCompleted,
  onBattleResulted,
  onMissionStart,
  onMapPrepare,
  onKaisouPowerup,
  onRecoveryStart,
  onRecoveryStartCompleted,
}

module.exports = RequestControllers;
