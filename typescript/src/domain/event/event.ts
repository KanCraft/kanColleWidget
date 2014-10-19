module KCW {
    export var EventKind: any = {
        NyukyoFinish: "nyukyo-finish",
        MissionFinish: "mission-finish",
        CreateshipFinish: "createship-finish",
        SortieFinish: "sortie-finish"
    };
    export interface EventCreateParams {
        key: number;// dock_idもしくはdeck_id
        kind: string;// EventKind
        finish: number;// 終了時刻タイムスタンプ
        label: string;// イベント短縮名 ex) "遠征帰投"
        prefix: string;// 通知文言接頭語
        suffix: string;// 通知文言接尾語
        unit: string;// "ドック"もしくは"艦隊"
    }
    export class EventModel {
        public key: number;
        public kind: string;
        public finish: number;
        public label: string;
        public prefix: string;
        public suffix: string;
        public unit: string;
        constructor(params: EventCreateParams) {
            this.key = params.key;
            this.kind = params.kind;
            this.finish = params.finish;
            this.label = params.label;
            this.prefix = params.label;
            this.suffix = params.suffix;
            this.unit = params.unit;
        }
        public toPayload(): KCW.API.Payload {
            return {
                timestamp: Date.now(),
                event: {
                    target: this.kind.split("-")[0],
                    type: "created",
                    finish: this.finish,
                    params: {
                        format: this.toFormat(),
                        key: this.key,
                        label: this.label,
                        unit: this.unit
                    }
                }
            }
        }
        public toFormat(): string {
            return this.prefix + "%d" + this.suffix;
        }
        public toMessage(): string {
            return this.prefix + this.key + this.suffix;
        }
    }
}