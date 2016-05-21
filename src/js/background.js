import Hello from './Components/Hello';
chrome.runtime.onMessage.addListener((a, b, c) => {
  let hello = new Hello();
  c({hoge: hello.foo()});
  return true;
});
