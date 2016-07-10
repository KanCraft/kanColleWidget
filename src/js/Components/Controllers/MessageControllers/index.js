import {
  GetConfig,
  SetConfig,
} from './Config';
import {
  GetAll,
} from './Frame';
import {
  OpenWindow,
  ShouldDecorateWindow,
} from './Window';
import { GetHistory } from './History';

const MessageControllers = {
  GetConfig,
  SetConfig,
  OpenWindow,
  ShouldDecorateWindow,
  GetHistory,
  GetAllFrames: GetAll,
};

module.exports = MessageControllers;
