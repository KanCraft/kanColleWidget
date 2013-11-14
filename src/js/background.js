/**
 * background.js
 * ここはなるべくイベントのバインドしか書かない
 *
 * 注意: トップレベル以外で`chrome`文言を書かない
 */

"use strict";

var Stash = {
    createItem : null,
    createShip : {
        1 : {},
        2 : {},
        3 : {},
        4 : {}
    }
};

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
    // これふと思ったんだけどListenerのなかでインスタンス化しなくてよくね？
    // executeがdataを受け取るようにしようぜ
    var dispatcher = new Dispatcher(data);
    var action     = new Action();
    dispatcher.bind(action).execute();
},{'urls':[]},['requestBody']);

var completeDispatcher = new CompleteDispatcher();
completeDispatcher.bind(new Action());
chrome.webRequest.onCompleted.addListener(function(detail){
    completeDispatcher.eat(detail).execute();
},{'urls':[]});

/***** Main Listener 03 : メッセージの受信 *****/
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

    if(message.purpose == 'screenshot'){
        Util.detectAndCapture();
        return;
    }

    if(message.purpose == 'positionTracking'){
        var widgetInfo = Tracking.get('widget');
        widgetInfo.position = message.position;
        widgetInfo.size     = message.size;
        Tracking.set('widget',widgetInfo);
        return;
    }

	if( message.winId == undefined ) return;

    Util.openCapturedPage(message.winId);
});

/***** Main Listener 04 : 通知クリックされたとき *****/
chrome.notifications.onClicked.addListener(function(){
    if(Config.get('launch-on-click-notification')){
        Util.focusOrLaunchIfNotExists(Tracking.get('mode'));
    }else{
        Util.focusKCWidgetWindow();
    }
});
