import { Logger } from "chromite";
import Queue from "../../models/Queue";

export async function Once() {
  const logger = new Logger("QueueWatcher");
  const queues = await Queue.list();
  logger.debug(`Found ${queues.length} queues`, queues);
}
