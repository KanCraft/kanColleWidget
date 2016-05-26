// console.log(chrome.runtime.getManifest());
chrome.runtime.connect();
chrome.runtime.sendMessage({act: '/history/get'}, (res) => {
  console.log("RESPONSE of /foo", res);
});
