import { Router, SerialRouter, Logger } from 'chomex';

// タイマーなんかを監視するintervalをスタート
import QueueObserver from '../Components/Routine/QueueObserver';
QueueObserver.start();

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

// {{{ Global pollution
Image.init = function(url) {
  return new Promise(resolve => {
    let image = new Image();
    image.onload = () => {
      resolve(image);
    }
    image.src = url;
  })
};
window.sleep = function(seconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}
// }}}
