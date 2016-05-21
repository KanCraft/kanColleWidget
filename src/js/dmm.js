console.log(chrome.runtime.getManifest());
chrome.runtime.connect();
chrome.runtime.sendMessage({msg: 'Hello, this is content script'}, (res) => {
  console.log("GET RESPONSE!!", res);
});
