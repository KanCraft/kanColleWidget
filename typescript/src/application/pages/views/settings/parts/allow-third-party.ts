/// <reference path="../checkbox.ts" />

module KCW.Pages {
    export class AllowThirdParty extends CheckboxView {
        constructor() {
            super({
                title: "外部Chrome拡張の連携を許す",
                configKey: "allow-third-party",
                description: "詳しくは<a href='https://github.com/otiai10/kanColleWidget/wiki/KanColleWidget-ChromeExt-API'>ここ</a>「艦これタイマー for iOS」とかそういうやつを想定しています。外部Chrome拡張が連携を試みようとしてきた時に再度警告&確認しますもちろん。現在連携してるアプリ一覧↓\<br>" + SubscribersRepository.local().toListHTML() + "この設定を解除すると以上のアプリ連携はすべて削除されます。"
            });
        }
        checkboxChanged(ev: Event) {
            super.checkboxChanged(ev);
            if ($(ev.currentTarget).prop("checked") == false) {
                SubscribersRepository.local().deleteAll();
            }
        }
    }
}