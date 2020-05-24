import { Router } from "chomex";
import { Screenshot } from "../Controllers/Alarms";

const resolver = (alarm) => {
  const [name, query] = alarm.name.split("?");
  alarm.params = new URLSearchParams(query);
  return {name};
};

const router = new Router(resolver);

router.on("/screenshot", Screenshot);

export default router.listener();
