let version = '001'
window.alert(version);
console.log('chrome', chrome);
chrome.runtime.sendMessage(nil, {act: `version ${version}`}, function(res) {
  console.log(res);
});
