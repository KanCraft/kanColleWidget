// DECORATION
const FRAME_SHIFT = 'FRAME_SHIFT',
      WIDGETIZE   = 'WIDGETIZE';

const url = "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/";

export function GetConfig(message) {
  return {
    data: {
      "__white": {
        alias: "WHITE (default size)",
        url: url,
        decoration: FRAME_SHIFT,
        size: {

        }
      },
      "1": {
        alias: "せっていできるサムシング",
        url: url,
        decoration: WIDGETIZE,
        size: {
          
        }
      },
    }
  };
}
export function SetConfig(message) {
  return {minase: 'いのり'};
}
