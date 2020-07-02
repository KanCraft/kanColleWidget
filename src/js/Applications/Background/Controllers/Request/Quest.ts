import { DebuggableRequest } from "../../../../definitions/debuggable";
import { QuestProgress } from "../../../Models/Quest";

export async function OnQuestStart(req: DebuggableRequest) {
  const { requestBody: { formData: { api_quest_id: [id] } } } = req;
  QuestProgress.user().start(parseInt(id, 10));
}

export async function OnQuestStop(req: DebuggableRequest) {
  const { requestBody: { formData: { api_quest_id: [id] } } } = req;
  QuestProgress.user().stop(parseInt(id, 10));
}

export async function OnQuestComplete(req: DebuggableRequest) {
  const { requestBody: { formData: { api_quest_id: [id] } } } = req;
  QuestProgress.user().complete(parseInt(id, 10));
}