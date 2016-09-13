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
  onBattleStarted,
} from './Battle'

import {
  onRecoveryStart,
  onRecoveryStartCompleted,
} from './Recovery';

import {
  onHomePort,
} from './Port';

const RequestControllers = {
  onKoushoCreateShipCompleted: onCreateShipCompleted,
  onBattleResulted,
  onBattleStarted,
  onMissionStart,
  onMapPrepare,
  onKaisouPowerup,
  onRecoveryStart,
  onRecoveryStartCompleted,
  onHomePort,
}

module.exports = RequestControllers;
