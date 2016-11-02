import * as ConfigControllers  from "./Config";
import * as FrameControllers   from "./Frame";
import * as QueuesControllers  from "./Queue";
import * as WindowControllers  from "./Window";
import * as TwitterControllers from "./Twitter";
import * as HistoryControllers from "./History";
import * as LaunchPositionControllers from "./LaunchPosition";
import * as DebugControllers   from "./Debug";

const MessageControllers = {
    ...ConfigControllers,
    ...WindowControllers,
    ...HistoryControllers,
    ...FrameControllers,
    ...QueuesControllers,
    ...TwitterControllers,
    ...LaunchPositionControllers,
    ...DebugControllers,
};

module.exports = MessageControllers;
