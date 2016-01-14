/// <reference path="../checkbox.ts" />

module KCW.Pages {
    export class PanelizeShipsStatus extends CheckboxView {
        constructor() {
            super({
                title: "大破進撃防止窓を、常に最前面表示",
                configKey: "panelize-ships-status",
                description: "clockmodeの最前面化と同様の設定が必要です。あと右下にいっちゃうのしかたないっぽい。"
              });
        }
    }
}
