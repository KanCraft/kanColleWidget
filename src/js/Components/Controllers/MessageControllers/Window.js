import WindowService from '../../Services/WindowService';
import {Client} from 'chomex';

const POPUP = 'popup';

const windowService = new WindowService();
const client = new Client(chrome.tabs);

// TODO: オンメモリな何かはどっかにやる
let generated = [];

export function OpenWindow(message) {
  // TODO: https://github.com/otiai10/kcwidget/issues/7
  let params = {
    url: message.win.url,
    width: 800,
    height: 480,
  };

  // TODO: window参照しちゃうんですね
  if (!window.navigator.userAgent.match('Firefox')) {
    params['type'] = 'popup';
  }

  return new Promise((res, rej) => {
    windowService.open(params).then(win => {
      generated.push({tab: win.tabs[0], ...message.win});
      res(win);
    });
  });
}

export function ShouldDecorateWindow(message) {
  const win = generated.find(win => {
    return (win.tab.id == this.sender.tab.id);
  });
  if (win) return {status: 200, data: win};
  else return {status: 404};
}
