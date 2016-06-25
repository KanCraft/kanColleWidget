import {Logger} from 'chomex';
const logger = new Logger();

import {Mission, ScheduledQueues} from '../../Models/Queue/Queue';

export function onMissionStart(detail) {
  const data = detail.requestBody.formData;
  const mission = Mission.createFromFormData(data);
  ScheduledQueues.append('missions', mission);
}
