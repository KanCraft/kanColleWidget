import Hello from './Components/Hello';
import {Foo} from './Components/Controllers/RequestController'
import {
  GetHistory
} from './Components/Controllers/Message/History';

import { Router, WebRequestRouter } from 'chomex';

// chrome.runtime.onMessage.addListener((a, b, c) => {
//   let hello = new Hello();
//   c({hoge: hello.foo()});
//   return true;
// });

let router = new Router();
router.on('/history/get', GetHistory);

chrome.runtime.onMessage.addListener(router.listener());

let reqrouter = new WebRequestRouter();

reqrouter.on([{url: /api_port/}, {url: /api_get_member/}, {url: /api_port/}], Foo);

chrome.webRequest.onBeforeRequest.addListener(
  reqrouter.listener(),
  {'urls':["*://*/kcsapi/*"]},
  ['requestBody']
);
