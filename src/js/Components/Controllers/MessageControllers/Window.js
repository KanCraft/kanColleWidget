import WindowService from '../../Services/WindowService';

const POPUP = 'popup';

const windowService = new WindowService();

export function OpenWindow(message) {
  // TODO: https://github.com/otiai10/kcwidget/issues/7
  let params = {
    url: message.win.url,
    width: 800,
    height: 480,
  };
  if (!window.navigator.userAgent.match('Firefox')) {
    params['type'] = 'panel';
  }
  windowService.open(params).then(win => {
    console.log('002', win);
  })
  // chrome.windows.create({}, (win) => {
  //   console.log('002', win);
  // });
  return 100;
}
