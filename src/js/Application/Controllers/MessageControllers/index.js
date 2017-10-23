import * as ConfigControllers  from "./Config";
import * as SyncControllers    from "./Sync";
import * as FrameControllers   from "./Frame";
import * as QueuesControllers  from "./Queue";
import * as WindowControllers  from "./Window";
import * as TwitterControllers from "./Twitter";
import * as StreamControllers  from "./Stream";
import * as HistoryControllers from "./History";
import * as LaunchPositionControllers from "./LaunchPosition";
import * as DamageSnapshotControllers from "./DamageSnapshot";
import * as ResourceControllers from "./Resource";
import * as DebugControllers   from "./Debug";

const MessageControllers = {
  ...ConfigControllers,
  ...SyncControllers,
  ...WindowControllers,
  ...HistoryControllers,
  ...FrameControllers,
  ...QueuesControllers,
  ...TwitterControllers,
  ...StreamControllers,
  ...LaunchPositionControllers,
  ...DamageSnapshotControllers,
  ...ResourceControllers,
  ...DebugControllers,
};

module.exports = MessageControllers;
