(function(){
  var amazon = /^https?:\/\/www\.amazon\.[co.jp|com].+(\/[a-zA-Z0-9]{10}\/)/;
  var exists = /[&|?]tag=[^&?=]+/;
  var search = /[?][^?]+$/;
  var message = "『艦これウィジェット』の「錬金カンパ」設定がオフなので何もしません！" +
  "詳しくは、設定画面の「錬金カンパを有効にする」項目の説明を参照してください。";
  chrome.runtime.sendMessage(null, {
      purpose: "getConfig_v2",
      configKey: "allow-kampa-alchemy"
  }, function (allowed) {
    if (!allowed) return console.info(message);
    chrome.runtime.sendMessage(null, {
      purpose: "getTag"
    }, function (tag) {
      if (!tag) return;// 開発者タグが無いのでなにもしない
      var links = document.getElementsByTagName("a") || [];
      for (var i = 0, l = links.length; i < l; i++) {
        var href = links[i].href || "";
        if (!amazon.test(href)) continue;// amazonリンクじゃないのでなにもしない
        if (exists.test(href)) continue;// すでにtagついてるのでなにもしない
        if (!search.test(href)) continue;// getクエリがついてないのでなにもしない
        links[i].href = links[i].href.replace("?", "?tag="+tag+"&");
        // console.log(links[i]);
      }
    });
  });
})();
