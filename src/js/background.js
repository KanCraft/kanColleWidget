import Hello from './Components/Hello';
import { MessageRouter, WebRequestRouter, Controller } from 'chomex';

// chrome.runtime.onMessage.addListener((a, b, c) => {
//   let hello = new Hello();
//   c({hoge: hello.foo()});
//   return true;
// });

let router = new MessageRouter();
router.on('/foo', new Controller());
router.on('/bar', new Controller());

chrome.runtime.onMessage.addListener(router.listener());

let reqrouter = new WebRequestRouter();
// reqrouter.on((sequence) => {
//   console.log('in match func!!', sequence);
//   return true;
// }, (detail) => {
//   console.log('in controller!!', detail);
// });
reqrouter.on([{url: /api_port/}, {url: /api_get_member/}, {url: /api_port/}], (detail, sequence) => {
  console.log('コントローラだよん', sequence);
});

chrome.webRequest.onBeforeRequest.addListener(
  reqrouter.listener(),
  {'urls':["*://*/kcsapi/*"]},
  ['requestBody']
);
