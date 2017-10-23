
import Config from "../../Models/Config";


export function GetConfig(message) {
  if (!message.key) return {status: 400, message: "config key is not specified"};
  let config = Config.find(message.key);
  if (!config) return {status: 404, message: `config for key "${message.key}" not existing`};
  return config;
}
export function SetConfig(/* message */) {
  return {minase: "いのり"};
}
