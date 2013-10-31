/**
 * testemがchromeオブジェクトを取れないので、処理の無い擬似的なchromeオブジェクトをココに定義する
 *
 * testemを動かしてobjectのキーエラーが出るたびに、ここに追加されていくべき
 * キーの配置と型さえ合っていれば、カオスになっても構わない
 */

var defaultRequestDataObject = {
    url : ''
}

var defaultEventObject = {
    addListener : function(listener){
        // これでいいのか？
        listener(defaultRequestDataObject);
    }
}

var chrome = {
    windows : {
        /* event object */onBeforeRequest : defaultEventObject,
        /* event object */onFocusChanged : defaultEventObject,
        /* function */getCurrent : function(p,f){
            f(chrome.windows);
        },
        /* Array */tabs : [
        ],
        /* function */getAll : function(p,f){
            f(chrome.windows);
        }
    },
    webRequest : {
        /* event object */onBeforeRequest : defaultEventObject
    },
    tabs : {},
    browserAction : {
        /* function */getBadgeText : function(){}
    },
    runtime : {
        /* event object */onMessage : defaultEventObject
    },
    notifications : {
        /* event object */onClicked : defaultEventObject
    }
}
