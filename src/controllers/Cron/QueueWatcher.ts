import Queue from "../../models/Queue";

export async function Once() {
  const queues = await Queue.list();
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];
    if (queue.scheduled < Date.now()) {
      const e = queue.entry();
      await chrome.notifications.create(e.$n.id(), e.$n.options())
      await queue.delete();
    }
  }
}
