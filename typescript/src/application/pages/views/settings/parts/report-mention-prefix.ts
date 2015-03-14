/// <reference path="../checkbox.ts" />

module KCW.Pages {
    export class ReportMentionPrefix extends CheckboxView {
        constructor() {
            super({
                title: "開発・建造報告ツイートを@にする",
                configKey: "report-mention-prefix",
                description: "開発・建造報告のツイートに<a href='https://twitter.com/KanColle_REPORT'>報告ちゃん</a>への@を付けます（TL汚さない的な意味で）"
            });
        }
    }
}