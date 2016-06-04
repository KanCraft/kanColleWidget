import Hello from './Components/Hello';
import {Foo} from './Components/Controllers/RequestController'
import {
  GetConfig,
  SetConfig,
} from './Components/Controllers/MessageControllers';

import { Router, WebRequestRouter } from 'chomex';

let router = new Router();
router.on('/config/get', GetConfig);
router.on('/config/set', SetConfig);

chrome.runtime.onMessage.addListener(router.listener());

let reqrouter = new WebRequestRouter();

reqrouter.on([{url: /api_port/}, {url: /api_get_member/}, {url: /api_port/}], Foo);

chrome.webRequest.onBeforeRequest.addListener(
  reqrouter.listener(),
  {'urls':["*://*/kcsapi/*"]},
  ['requestBody']
);
