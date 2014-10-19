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
        missionId?: number;// 遠征ID
        toMessage(): string;
    }
    /**
     * 古いデータフォーマットと新しいモデルの緩衝レイヤ
     */
    export class EventFactory {
        public static createFromObsoleteEventModel(model: ObsoleteEventModel): EventModel {
            var params: EventCreateParams = EventFactory.obsoleteEventModelToCreateParams(model);
            return new Mission(params, {title:model.title, id:model.missionId});
            /*
            switch (params.kind) {
                case EventKind.MissionFinish:
                    return new Mission(params, {title:model.title, id:model.missionId});
            }
            */
        }
        private static obsoleteEventModelToCreateParams(model: ObsoleteEventModel): EventCreateParams {
            return {
                key: model.primaryId,
                kind: model.kind,
                finish: model.finish,
                label: model.label,
                prefix: model.prefix,
                suffix: model.suffix,
                unit: EventFactory.getUnitName(model.kind)
            }
        }
        private static getUnitName(kind: string): string {
            switch(kind) {
                case EventKind.MissionFinish:
                case EventKind.SortieFinish:
                    return "艦隊";
                case EventKind.CreateshipFinish:
                case EventKind.NyukyoFinish:
                default:
                    return "ドック";
            }
        }
    }
}