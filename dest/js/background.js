chrome.runtime.onMessage.addListener((msg, sender, res) => {
  console.log(msg, sender, res);
  res({msg: 'this is background'});
});
