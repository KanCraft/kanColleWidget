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
    ifCurrentIsKCWidgetWindow(function(){
       clearBadge();
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
	if( message.winId != undefined ){
		chrome.tabs.captureVisibleTab(message.winId, {'format':'png'}, function(dataUrl){
			var win = window.open();
			var img = document.createElement('img');
			img.src = dataUrl;
			var date = new Date().toLocaleString();
			win.document.title = date;
			win.document.body.appendChild(img);
		});
	}
});
