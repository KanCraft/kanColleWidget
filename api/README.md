https://github.com/otiai10/kanColleWidget/wiki/KanColleWidget-ChromeExt-API

# What is KanColleWidget API?

KanColleWidgetは「艦これ」でのユーザアクティビティをフックにし、自作OCRサーバに画像を送信して、入渠や建造にかかる時間を決定しています.

`KanColleWidget API`は、艦これウィジェットがフックできたイベントや、決定した所要時間に、**ユーザの承認のうえ**他のChrome拡張（以下「クライアント」）から利用できるAPIです.

# Overview

- [Subscribe API](https://github.com/otiai10/kanColleWidget/wiki/WidgetAPI#subscribe-api)

# `Subscribe` API

**Subscribe API**を利用することで、クライアントは艦これウィジェット内でフックできたイベントとその付随する情報（遠征IDや建造終了時間など）をリアルタイムでSubscribeすることができます.

## request
下記のrequestでは、遠征出発時のイベントのsubscribeを登録できます
```javascript
// request
{
    path: "/api/subscribe", // required string
    params: { // optional Object
        // !!caution!! `filter` is not implemented yet
        filter: ["mission"] // optional []string
    }
}
````
## response
requestが受け付けられた場合、`status.code`は200が返り、`error`はundefinedとなります.
一方、requestが受け付けられなかった場合、`status.code`は200以外が返り、`result`はundefinedになります.
```javascript
// response
{
    status: { // `status` must returns
        code: 200, // int
        text: "OK" // string
    },
    result: { // `result` returns only if status.code == 200
        accepted: ["mission"]
    },
    error: { // `error` returns if status.code != 200
        code: 1001, // int
        text: "Registration denied by user"
    }
}
```
## payload
正常にsubscribeできている場合は、艦これウィジェット内でイベントをフックしたときに以下のデータが`chrome.runtime.sendMessage`によって送信されます.
```javascript
// payload
{
    timestamp: 1406361612543, // time payload sent
    event: {
        target: "createship", // "mission", "nyukyo" or "createsip"
        type: "created", // "created" only so far
        finish: 1406362691542, // timestamp when this target finish
        params: { // appended parameters
            format: "第%d建造ドックでの建造作業がまもなく完了します", // notification format user defined
            id: 4, // the identifier for the target (maybe used with format)
            label: "建造完了" // the label of notification
        }
    }
}
```
## sample
下記のサンプルでは、全てのイベントに対してsubscribeを登録します.
```javascript
// Start subscribing.
var kcwExtId = "iachoklpnnjfgmldgelflgifhdaebnol";
var request = {
    path: "/api/subscribe"
};
chrome.runtime.sendMessage(kcwExtId,request,function(response) {
    console.log(response);
});
```
subscribeしているイベントを受け取るクライアントサイドのサンプルです.
```javascript
// Define subscriber.
// Listening
var kcwExtId = "iachoklpnnjfgmldgelflgifhdaebnol";
chrome.runtime.onMessageExternal(function(message, sender) {
    if (sender.id == kcwExtId) {
        // This message should be a event hooked and parsed by KanColleWidget
    }
});
```

- https://github.com/otiai10/SampleClient
