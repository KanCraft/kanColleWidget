import Hello from './Components/Hello';
chrome.runtime.onMessage.addListener((a, b, c) => {
  c({hoge: true});
});
// const chrome = chrome || {};
//
// chrome.runtime.onMessage.addListener((a, b, c) => {
//   console.log(a, b, c);
//   c({a, b});
// });
