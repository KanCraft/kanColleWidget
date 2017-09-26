import Quest from "../../Models/Quest";

function id(message) {
  const {requestBody:{formData:{api_quest_id:[id]}}} = message;
  return id;
}

export function onQuestStart(message) {
  let quest = Quest.find(id(message));
  if (quest) quest.undertake();
}

export function onQuestStop(message) {
  let quest = Quest.find(id(message));
  if (quest) quest.cancel();
}

export function onQuestDone(message) {
  let quest = Quest.find(id(message));
  if (quest) quest.done();
}
