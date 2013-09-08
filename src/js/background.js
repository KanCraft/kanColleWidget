/**
 * background.js
 * ここはなるべくイベントのバインドしか書かない
 */

var observer = new Observer();

/***** JSがロードされたとき *****/
(function(){
    observer.start();
})();

/***** Main Listener 01 : ウィンドウのフォーカスが変わるとき *****/
chrome.windows.onFocusChanged.addListener(function(windowId){
    Util.ifCurrentIsKCWidgetWindow(function(){
        Util.badge.clear();
    });
});

/***** Main Listener 02 : ブラウザからHTTPRequestが送信される時 *****/
chrome.webRequest.onBeforeRequest.addListener(function(data){
    var dispatcher = new Dispatcher(data);
    var action     = new Action();
    dispatcher.bind(action).execute();
},{'urls':[]},['requestBody']);

/***** Main Listener 03 : メッセージの受信 *****/
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

	if( message.winId == undefined ) return;

    Util.openCapturedPage(message.winId);
});
