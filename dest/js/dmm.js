console.log('manifest', chrome.runtime.getManifest());
let extId = chrome.i18n.getMessage("@@extension_id");
chrome.runtime.connect();
chrome.runtime.sendMessage({act: `AAA`}, function(res) {
  console.log(`This is response:\n"${JSON.stringify(res)}"`)
});
