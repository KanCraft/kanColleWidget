if (location.href.match(/^https:\/\/twitter.com\/intent\/tweet\/complete.*$/)) {
    chrome.runtime.sendMessage(null,{purpose: 'tweetCompleted'});
}
