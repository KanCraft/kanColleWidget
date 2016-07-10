import {ScheduledQueues} from '../../Models/Queue/Queue';
export function GetQueues(message) {
  return ScheduledQueues.all();
}
