/// <reference path="./event.ts" />

module KCW {
    export interface ObsoleteEventModel {
        finish: number;// 1411138947059
        prefix: string;// "第"
        primaryId: number;// 2
        suffix: string;// "艦隊がまもなく帰投します"
        kind: string;// "mission-finish"
        label: string;// "遠征帰投"
        title?: string;// "長距離練習航海"
        info?: any;
        unit: string;// 艦隊
        toMessage(): string;
    }
    /**
     * 古いデータフォーマットと新しいモデルの緩衝レイヤ
     */
    /* もういいやめんどくせえとりあえず今回はbadgeモジュールの要求だけ満たせばいいわけであって
    export class EventFactory {
        public static createFromObsoleteEventModel(model: ObsoleteEventModel): EventModel {
            switch (model.kind) {
                case EventKind.MissionFinish:
                    return new Mission();
                default:
                    return EventModel.createWithParams({

                    });
            }
        }
    }
    */
}