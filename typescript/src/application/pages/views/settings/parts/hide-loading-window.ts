/// <reference path="../checkbox.ts" />

module KCW.Pages {
    export class HideLoaderWindow extends CheckboxView {
        constructor() {
            super({
                title: "「取得中」窓をあえて出さない",
                configKey: "hide-loader-window",
                description: "ご存知のように『艦これウィジェット』は、入渠や建造にかかる時間の取得を、" +
                "運営サーバに不正なリクエストを送らないように、自前のサーバへ画面のキャプチャを送り画像解析することで実現しています" +
                "（くわしくは<a href='http://www.slideshare.net/otiai10/ss-26908975' target='_blank'>『加賀さんと僕 実装編』</a>をご参考ください）。<br>" +
                "したがって、入渠や建造をするときその所要時間が画面に表示される前にその画面から遷移してしまってはこれは機能しません。" +
                "これを防ぐためにあえて「取得中...」という小窓を出すことで、所要時間描画および画像解析完了まで画面にとどまってもらうように工夫しております。<br>" +
                "もしなんらかの理由（たとえばニコ生で実況してるときとか）でこれが必要ないという場合は、この設定項目をONにしてください。"
            });
        }
    }
}
