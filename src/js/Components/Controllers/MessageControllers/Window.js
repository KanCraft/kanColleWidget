import WindowService from '../../Services/WindowService';
import {Client} from 'chomex';

const POPUP = 'popup';

const windowService = new WindowService();
const client = new Client(chrome.tabs);

export function OpenWindow(message) {
  // TODO: https://github.com/otiai10/kcwidget/issues/7
  let params = {
    url: message.win.url,
    width: 800,
    height: 480,
  };
  if (!window.navigator.userAgent.match('Firefox')) {
    params['type'] = 'popup';
  }

  return new Promise((res, rej) => {
    windowService.open(params).then(win => {
      const id = win.tabs[0].id;
      setTimeout(() => {
        client.message(id, {act: '/page/dmm/resize'});
      }, 2000);
      res(win);
    })
  })
}
