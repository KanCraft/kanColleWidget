import {Foo} from './Components/Controllers/RequestController'
import {
  GetConfig,
  SetConfig,
  OpenWindow,
  ShouldDecorateWindow,
} from './Components/Controllers/MessageControllers';

// Message Router
let router = new Router();
router.on('/config/get', GetConfig);
router.on('/config/set', SetConfig);
router.on('/window/open', OpenWindow);
router.on('/window/should-decorate', ShouldDecorateWindow);
chrome.runtime.onMessage.addListener(router.listener());

// Web Request Router
import { Router, SerialRouter } from 'chomex';
let reqrouter = new SerialRouter();
reqrouter.on([{url: /api_port/}, {url: /api_get_member/}, {url: /api_port/}], Foo);
chrome.webRequest.onBeforeRequest.addListener(
  reqrouter.listener(),
  {'urls':["*://*/kcsapi/*"]},
  ['requestBody']
);
