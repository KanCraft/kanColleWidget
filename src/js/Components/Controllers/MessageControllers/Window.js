import WindowService from '../../Services/WindowService';
import CaptureService from '../../Services/CaptureService';
import {Client} from 'chomex';
import Frame from '../../Models/Frame';
import History from '../../Models/History';

const POPUP = 'popup';

const windows = WindowService.getInstance();
const captures = new CaptureService();
const client = new Client(chrome.tabs);

export function OpenWindow(message) {

  const id = message.frame;

  const frame = Frame.find(id);
  if (!frame) {
    alert(id);
    return;
  }

  // last-selected-frameとしてHistoryに保存する
  let lastSelectedFrame = History.find('last-selected-frame');
  lastSelectedFrame.id = id;
  lastSelectedFrame.save();
  // TODO: 別途、contents_scriptから「窓位置」を記憶するためのMessageを送る
  // TODO: HistoryクラスってJS標準にあったので、AppHistoryとかにrenameする

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

export function CaptureWindow(message) {
  return Promise.resolve().then(() => {
    return windows.find()
  }).then(tab => {
    return captures.capture(tab.windowId);
  });
}
