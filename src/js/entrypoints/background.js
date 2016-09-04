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
