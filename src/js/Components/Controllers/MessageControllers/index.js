import * as ConfigControllers  from './Config';
import { GetAll } from './Frame';
import * as QueuesControllers  from './Queue';
import * as WindowControllers  from './Window';
import * as TwitterControllers from './Twitter';
import * as HistoryControllers from './History';

const MessageControllers = {
  ...ConfigControllers,
  ...WindowControllers,
  ...HistoryControllers,
  GetAllFrames: GetAll,
  ...QueuesControllers,
  ...TwitterControllers,
};

module.exports = MessageControllers;
