import { Router, SerialRouter, Logger } from 'chomex';

// タイマーなんかを監視するintervalをスタート
import QueueObserver from '../Components/Routine/QueueObserver';
QueueObserver.start();

// {{{ DEBUG
// import Rectangle from '../Components/Services/Rectangle';
// chrome.tabs.getAllInWindow(3990, function(tabs) {
//   chrome.tabs.captureVisibleTab(tabs[0].windowId, {}, function(dataUrl) {
//     var img = new Image();
//     img.onload = function() {
//       let rect = (new Rectangle(0, 0, img.width, img.height))
//         .removeBlackspace().shipsStatus();
//       var canvas = document.createElement('canvas');
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//       canvas.getContext('2d').drawImage(
//         img,
//         rect.x, rect.y, rect.width, rect.height,
//         0, 0, rect.width, rect.height
//       );
//       window.open(canvas.toDataURL());
//     };
//     img.src = dataUrl;
//   })
// });
// }}}

// sendMessageを受けるroutesを定義
import MessageListener from '../Components/Routes/MessageRoutes';
chrome.runtime.onMessage.addListener(MessageListener);

// HTTP Requestを受けるroutesを定義
import {WebRequestListener, WebRequestOnCompleteListener} from '../Components/Routes/WebRequestRoutes';
chrome.webRequest.onBeforeRequest.addListener(
  WebRequestListener, {'urls':["*://*/kcsapi/*"]}, ['requestBody']
);
chrome.webRequest.onCompleted.addListener(
  WebRequestOnCompleteListener, {'urls':["*://*/kcsapi/*"]}, []
);

// NotificationのonClickを受けるroutesを定義
import NotificationClickListener from '../Components/Routes/NotificationClickRoutes';
chrome.notifications.onClicked.addListener(NotificationClickListener);
