import {Logger} from 'chomex';
const logger = new Logger();

import {Mission, ScheduledQueues} from '../../Models/Queue/Queue';

export function onMissionStart(detail) {
  const data = detail.requestBody.formData;
  const mission = Mission.createFromFormData(data);
  ScheduledQueues.append('missions', mission);
}

export function onMissionResult(detail) {
  // とりあえず
  chrome.notifications.getAll(notes => {
    Object.keys(notes).filter(id => { return id.match(/mission/); }).map(id => {
      chrome.notifications.clear(id);
    })
  })
}
