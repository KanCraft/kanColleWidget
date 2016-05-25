console.log(chrome.runtime.getManifest());
chrome.runtime.connect();
chrome.runtime.sendMessage({act: '/foo', name: 'Hello, this is content script'}, (res) => {
  console.log("GET RESPONSE!!", res);
});
chrome.runtime.sendMessage({act: '/bar', name: 'baaaaar'}, (res) => {
  console.log("GET RESPONSE!!", res);
});
chrome.runtime.sendMessage({act: '/baz', name: 'baaaaar'}, (res) => {
  console.log("GET RESPONSE!!", res);
});
