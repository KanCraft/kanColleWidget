// DECORATION
const FRAME_SHIFT = 'FRAME_SHIFT',
      WIDGETIZE   = 'WIDGETIZE';

import Config from '../../Models/Config';


const url = "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/";

export function GetConfig(message) {
  let config = Config.find(message.key);
  return config;
}
export function SetConfig(message) {
  return {minase: 'いのり'};
}
