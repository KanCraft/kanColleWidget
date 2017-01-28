
import Config from "../../Models/Config";


export function GetConfig(message) {
    let config = Config.find(message.key);
    return config;
}
export function SetConfig(/* message */) {
    return {minase: "いのり"};
}
