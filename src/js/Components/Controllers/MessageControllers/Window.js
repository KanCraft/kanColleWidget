import WindowService from '../../Services/WindowService';

const POPUP = 'popup';

const windowService = new WindowService();

export function OpenWindow(message) {
  windowService.open({
    url: message.win.url,
    width: 800,
    height: 480,
    type: message.win.type || POPUP
  }).then(win => {
    console.log(win);
  })
  return 100;
}
