/**
 * main.js
 * ここはなるべくイベントのバインドしか書かない
 * 注意: トップレベル以外で`chrome`文言を書かない
 */
var oauth = chrome.extension.getBackgroundPage()['oauth'] || ChromeExOAuth.initBackgroundPage({
    'request_url': "https://api.twitter.com/oauth/request_token",
    'authorize_url': "https://api.twitter.com/oauth/authorize",
    'access_url': "https://api.twitter.com/oauth/access_token",
    'consumer_key': KanColleWidget.TwitterConfig.consumer_key,
    'consumer_secret': KanColleWidget.TwitterConfig.consumer_secret
});
var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";

    var observer = new KanColleWidget.Observer();
    var dispatcher = new KanColleWidget.Dispatcher();
    var completeDispatcher = new KanColleWidget.CompleteDispatcher();

    var action = new KanColleWidget.Action();
    dispatcher.bind(action);
    completeDispatcher.bind(action);

    observer.start();

    /***** Main Listener 01 : ウィンドウのフォーカスが変わるとき *****/
    chrome.windows.onFocusChanged.addListener(function(windowId){
        Util.ifCurrentIsKCWidgetWindow(function(){
            Util.badge.clear();
        });

    });

    /***** Main Listener 02 : ブラウザからHTTPRequestが送信される時 *****/
    chrome.webRequest.onBeforeRequest.addListener(function(data){
        dispatcher.eat(data).execute();
    },{'urls':[]},['requestBody']);

    chrome.webRequest.onCompleted.addListener(function(detail){
        completeDispatcher.eat(detail).execute();
    },{'urls':[]});

    /***** Main Listener 03 : メッセージの受信 *****/
    chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

        if(message.purpose == 'screenshot'){
            Util.detectAndCapture();
            return;
        }

        if(message.purpose == 'download'){
            Util.downloadImage(null, message.data);
            return;
        }

        if(message.purpose == 'positionTracking'){
            var widgetInfo = Tracking.get('widget');
            widgetInfo.position = message.position;
            widgetInfo.size     = message.size;
            Tracking.set('widget',widgetInfo);
            return;
        }

        if(message.purpose == 'dashboardTracking'){
            var dashboardInfo = Tracking.get('dashboard');
            dashboardInfo.position = message.position;
            dashboardInfo.size     = message.size;
            Tracking.set('dashboard',dashboardInfo);
            return;
        }

        if(message.purpose == 'statusWindowPositionTracking'){
            var statusWindowInfo = Tracking.get('statusWindow');
            statusWindowInfo.position = message.position;
            statusWindowInfo.size = message.size;
            Tracking.set('statusWindow',statusWindowInfo);
            return;
        }

        if(message.purpose == 'getConfig'){
            var res = {};
            if(message.configKey) {
                res = Config.get(message.configKey);
            } else {
                res = Config.getJSON();
            }
            return sendResponse(res);
        }

        if(message.purpose == 'syncSave'){
            MyStorage.sync.save();
            return;
        }

        if(message.purpose == 'actionCall'){
            var res = {};
            action[message.actionName](message.params);
            return sendResponse(res);
        }

        if(message.purpose == 'tweetCompleted'){
            if (KanColleWidget.Stash.twitterShareWindowIds.length > 0) {
                setTimeout(function(){
                    for (var i in KanColleWidget.Stash.twitterShareWindowIds) {
                        chrome.windows.remove(KanColleWidget.Stash.twitterShareWindowIds[i]);
                    }
                    KanColleWidget.Stash.twitterShareWindowIds = [];
                },1000);
            }
        }

        if(message.purpose == 'authTwitter'){
            // TODO: アクションのほうがいいかな
            var oauth = oauth || chrome.extension.getBackgroundPage()['oauth'];
            oauth.clearTokens();
            if(message.clear) return;
            oauth.authorize(function(token, secret) {
                // TODO: アクションにしたほうがいい雰囲気出てきたww
                var s = new KanColleWidget.ServiceTwitter();
                var p = s.getProfile();
                p.done(function(user_profile){
                    // console.log(user_profile);
                    Config.set("twitter-screen-name", user_profile['screen_name']);
                })
            });
        }

        if (message.purpose == 'resizeWindowAtWhite') {
            Util.resizeWindowAtWhite(sender.tab);
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
})();
