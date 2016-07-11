import { Router, SerialRouter, Logger } from 'chomex';

// タイマーなんかを監視するintervalをスタート
import QueueObserver from '../Components/Routine/QueueObserver';

// {{{ DEBUG
import {Mission, ScheduledQueues} from '../Components/Models/Queue/Queue';
ScheduledQueues.append('missions', Mission.dummy());
// }}}

QueueObserver.start();

// sendMessageを受けるroutesを定義
import MessageListener from '../Components/Routes/MessageRoutes';
chrome.runtime.onMessage.addListener(MessageListener);

// HTTP Requestを受けるroutesを定義
import WebRequestListener from '../Components/Routes/WebRequestRoutes';
chrome.webRequest.onBeforeRequest.addListener(
  WebRequestListener, {'urls':["*://*/kcsapi/*"]}, ['requestBody']
);

// NotificationのonClickを受けるroutesを定義
import NotificationClickListener from '../Components/Routes/NotificationClickRoutes';
chrome.notifications.onClicked.addListener(NotificationClickListener);

// {{{ DEBUG
import WindowService from '../Components/Services/WindowService';
let windows = WindowService.getInstance();
import CaptureService from '../Components/Services/CaptureService';
import TrimService    from '../Components/Services/TrimService';
const capture = new CaptureService();

import {Picture} from 'crescent';
let pics = [];
Promise.all([
  new Picture(require('base64-image!../../img/x_0.png')).initialized,
  new Picture(require('base64-image!../../img/x_1.png')).initialized,
  new Picture(require('base64-image!../../img/x_2.png')).initialized,
  new Picture(require('base64-image!../../img/x_3.png')).initialized,
  new Picture(require('base64-image!../../img/x_4.png')).initialized,
  new Picture(require('base64-image!../../img/x_5.png')).initialized,
  new Picture(require('base64-image!../../img/x_6.png')).initialized,
  new Picture(require('base64-image!../../img/x_7.png')).initialized,
  new Picture(require('base64-image!../../img/x_8.png')).initialized,
  new Picture(require('base64-image!../../img/x_9.png')).initialized
]).then(pics => {

  pics = pics.map(pic => pic.binarize(200));

  windows.find(true).then(tab => {
    capture.capture(tab.windowId).then(uri => {
      const trim = new TrimService(uri);
      return trim.trim();
    }).then(res => {
      return Promise.all(res.map(uri => {
        const pic = new Picture(uri);
        return pic.initialized.then(pic => {
          pic.binarize(200);
          pic.debug().open();
          return pic.compareTo(...pics).then(result => {
            return Promise.resolve(result.reduce((maxi, x, i, arr) => {
              return x.score > arr[maxi].score ? i : maxi
            }, 0));
          });
        });
      }));
    }).then(nums => {
      console.log(nums);
    });
  }).catch(err => {
  });
});
