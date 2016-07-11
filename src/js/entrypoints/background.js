import { Router, SerialRouter, Logger } from 'chomex';

// タイマーなんかを監視するintervalをスタート
import QueueObserver from '../Components/Routine/QueueObserver';
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
let pic0 = new Picture(require('base64-image!../../img/x_0.png'));
let pic1 = new Picture(require('base64-image!../../img/x_1.png'));
let pic2 = new Picture(require('base64-image!../../img/x_2.png'));

setTimeout(() => {
  pic0.binarize(180); pic1.binarize(180); pic2.binarize(180);
  windows.find(true).then(tab => {
    console.log(tab, CaptureService, TrimService);
    capture.capture(tab.windowId).then(uri => {
      const trim = new TrimService(uri);
      return trim.trim();
    }).then(res => {
      res.map(uri => {
        const pic = new Picture(uri);
        Promise.all([pic.initialized, pic0.initialized, pic1.initialized, pic2.initialized]).then(() => {
          pic.binarize(180);
          pic.compareTo(pic0, pic1, pic2).then(result => {
            console.log(result);
          });
        });
      })
    });
  }).catch(err => {
  });
}, 100);
