import {Foo} from './Components/Controllers/RequestController'
import {
  GetConfig,
  SetConfig,
  OpenWindow,
  ShouldDecorateWindow,
} from './Components/Controllers/MessageControllers';

import { Router, WebRequestRouter } from 'chomex';

let router = new Router();
router.on('/config/get', GetConfig);
router.on('/config/set', SetConfig);
router.on('/window/open', OpenWindow);
router.on('/window/should-decorate', ShouldDecorateWindow);

chrome.runtime.onMessage.addListener(router.listener());

let reqrouter = new WebRequestRouter();

reqrouter.on([{url: /api_port/}, {url: /api_get_member/}, {url: /api_port/}], Foo);

chrome.webRequest.onBeforeRequest.addListener(
  reqrouter.listener(),
  {'urls':["*://*/kcsapi/*"]},
  ['requestBody']
);
