/**
 * testemがchromeオブジェクトを取れないので、処理の無いchromeオブジェクトをココに定義する
 *
 * testemを動かしてobjectのキーエラーが出るたびに、ここに追加されていくべき
 * キーの配置と型さえ合っていれば、カオスになっても構わない
 */
var chrome = {
    windows : {
        /* event object */onBeforeRequest : defaultEventObject,
        /* event object */onFocusChanged : defaultEventObject,
        /* function */getCurrent : function(p,f){
            f();
        },
        /* Array */tabs : [
        ]
    },
    tabs : {},
    browserAction : {
        getBadgeText : function(){}
    }
}

var defaultEventObject = {
    addListener : function(listener){
        listener();
    }
}
