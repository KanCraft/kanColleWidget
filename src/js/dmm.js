// console.log(chrome.runtime.getManifest());
chrome.runtime.connect();
chrome.runtime.sendMessage({act: '/foo', name: 'Hello, this is content script'}, (res) => {
  console.log("RESPONSE of /foo", res);
});
chrome.runtime.sendMessage({act: '/bar', name: 'baaaaar'}, (res) => {
  console.log("RESPONSE of /bar", res);
});
chrome.runtime.sendMessage({act: '/baz', name: 'baaaaar'}, (res) => {
  console.log("RESPONSE of /baz", res);
});
chrome.runtime.sendMessage({act: '/hoge', name: 'aaaaa'}, (res) => {
  console.log("RESPONSE of /hoge", res);
});
