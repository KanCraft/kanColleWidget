import Hello from './Components/Hello';
import {Foo} from './Components/Controllers/RequestController'
import { MessageRouter, WebRequestRouter, Controller } from 'chomex';

// chrome.runtime.onMessage.addListener((a, b, c) => {
//   let hello = new Hello();
//   c({hoge: hello.foo()});
//   return true;
// });

let router = new MessageRouter();
router.on('/foo', (message, sender) => {
  console.log('/foo', this);
  return {msg: message.name};
});
router.on('/bar', (message, sender) => {
  console.log('/bar', this);
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve({data: `5秒後アタック！ ${message.name}`}); }, 5000);
  })
});
router.on('/hoge', (message, sender) => {
  console.log('/hoge', this);
  throw `なんかExceptionが飛んできた想定 ${message.name}`;
});

chrome.runtime.onMessage.addListener(router.listener());

let reqrouter = new WebRequestRouter();

reqrouter.on([{url: /api_port/}, {url: /api_get_member/}, {url: /api_port/}], Foo);

chrome.webRequest.onBeforeRequest.addListener(
  reqrouter.listener(),
  {'urls':["*://*/kcsapi/*"]},
  ['requestBody']
);
