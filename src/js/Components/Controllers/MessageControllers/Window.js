import WindowService from '../../Services/WindowService';
import {Client} from 'chomex';
import Frame from '../../Models/Frame';

const POPUP = 'popup';

const windows = WindowService.getInstance();
const client = new Client(chrome.tabs);

export function OpenWindow(message) {

  const id = message.frame;

  const frame = Frame.find(id);
  if (!frame) {
    alert(id);
    return;
  }

  return new Promise(resolve => {
    windows.open(frame).then(win => {
      resolve(frame);
    });
  });
}

export function ShouldDecorateWindow(message) {
  const tab = windows.has(this.sender.tab.id);
  if (tab) {
    return {status: 200, tab: tab};
  } else {
    return {status: 404};
  }
}
