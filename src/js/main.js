/**
 * main.js
 * ここはなるべくイベントのバインドしか書かない
 * 注意: トップレベル以外で`chrome`文言を書かない
 */
var silent = true;
var debug = (function(){
    return function (target) {
        // if (window.silent) return;
        // if (typeof target == "string") return console.log("%c" + target, "color:orange");
        // return console.log("[debug]", target);
    }
})();
var oauth = chrome.extension.getBackgroundPage()['oauth'] || ChromeExOAuth.initBackgroundPage({
    'request_url': "https://api.twitter.com/oauth/request_token",
    'authorize_url': "https://api.twitter.com/oauth/authorize",
    'access_url': "https://api.twitter.com/oauth/access_token",
    'consumer_key': KanColleWidget.TwitterConfig.consumer_key,
    'consumer_secret': KanColleWidget.TwitterConfig.consumer_secret
});
var KanColleWidget = KanColleWidget || {};
KanColleWidget.stream = (function() {
  var _stream = null;
  return function(revoke) {
    var d = $.Deferred();
    if (revoke) {
      _stream = null;
      d.resolve(null);
      return d.promise();
    }
    if (!_stream || !_stream.active) {
      chrome.tabCapture.capture({
        audio:false, video: true,
        videoConstraints: {
          mandatory: {
            chromeMediaSource: 'tab',
            // minWidth: 800, minHeight: 480,
            maxWidth: 800, maxHeight: 480
          }
        }
      }, function(stream) {
        _stream = stream;
        d.resolve(stream);
      });
    } else {
      console.log(_stream);
      d.resolve(_stream);
    }
    return d.promise();
  };
})();
(function(){
    "use strict";

    var observer = new KanColleWidget.Observer();
    var dispatcher = new KanColleWidget.Dispatcher();
    var completeDispatcher = new KanColleWidget.CompleteDispatcher();

    var action = new KanColleWidget.Action();
    dispatcher.bind(action);
    completeDispatcher.bind(action);

    observer.start();

    KCW.API.serve();

    /***** Main Listener 01 : ウィンドウのフォーカスが変わるとき *****/
    chrome.windows.onFocusChanged.addListener(function(windowId){
        Util.ifCurrentIsKCWidgetWindow(function(){
            Util.badge.clear();
        });

    });

    /***** Main Listener 02 : ブラウザからHTTPRequestが送信される時 *****/
    chrome.webRequest.onBeforeRequest.addListener(function(data){
        dispatcher.eat(data).execute();
    },{'urls':["*://*/kcsapi/*"]},['requestBody']);

    chrome.webRequest.onCompleted.addListener(function(detail){
        completeDispatcher.eat(detail).execute();
    },{'urls':["*://*/kcsapi/*"]});

    var shipsStatusRepo = KCW.ShipsStatusWindowRepository.local();

    /***** Main Listener 03 : メッセージの受信 *****/
    chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

        /*
        if(message.purpose == 'screenshot'){
            Util.detectAndCapture();
            return;
        }
        */

        if(message.purpose == 'download'){
            Util.downloadImage(null, message.data);
            return;
        }

        if(message.purpose == 'launch'){
            Util.focusOrLaunchIfNotExists();
            return;
        }

        if(message.purpose == "launchOrCapture"){
            Util.ifThereIsAlreadyKCWidgetWindow(function(){
                Util.detectAndCapture();
            },function(){
                Util.focusOrLaunchIfNotExists();
            });
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
            shipsStatusRepo.set(message.params);
            return;
        }
        if(message.purpose == 'getStatusWindowPositionTracking'){
            var stored = shipsStatusRepo.get();
            return sendResponse(stored);
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

        if (message.purpose == 'onClick') {
            KCW.onClickForCombinedShipsStatus();
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

    /***** command *****/
    chrome.commands.onCommand.addListener(function(command) {
      // console.log(command);
      switch (command) {
      case "toggle-mute":
        Util.ifThereIsAlreadyKCWidgetWindow(function(win) {
          chrome.tabs.update(win.tabs[0].id, {muted: !(win.tabs[0].mutedInfo || {}).muted});
        });
        break;
      case "capture":
        Util.detectAndCapture();
        break;
      case 'stream':
        KanColleWidget.stream().done(function(stream) {
          var streamURL= window.URL.createObjectURL(stream);
          window.open('src/html/gif-capture.html?fps=8&src=' + streamURL);
        });
      }
    });
})();
