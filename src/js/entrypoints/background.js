import { Router, SerialRouter, Logger } from 'chomex';

import QueueObserver from '../Components/Routine/QueueObserver';
QueueObserver.start();

import MessageListener from '../Components/Routes/MessageRoutes';
chrome.runtime.onMessage.addListener(MessageListener);

import WebRequestListener from '../Components/Routes/WebRequestRoutes';
chrome.webRequest.onBeforeRequest.addListener(
  WebRequestListener, {'urls':["*://*/kcsapi/*"]}, ['requestBody']
);
