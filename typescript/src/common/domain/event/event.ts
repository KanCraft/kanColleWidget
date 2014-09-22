module KCW {
    export var EventKind: any = {
        NyukoFinish: "nyukyo-finish",
        MissionFinish: "mission-finish",
        CreateshipFinish: "createship-finish",
        SortieFinish: "sortie-finish"
    };
    // TODO: あとで
    /**
     * まあほぼObsoleteEventModelと一緒なんだけどね
     */
    export interface EventCreateParams {
        kind: string;// "mission-finish"
        finish: number;// 1411138947059
        prefix: string;// "第"
        primaryId: number;// 2
        suffix: string;// "艦隊がまもなく帰投します"
        label: string;// "遠征帰投"
        fulltext?: string;//
    }
    export class EventModel {
        public static createWithParams(params: EventCreateParams) {
            return new this(params.kind,
                            params.finish,
                            params.prefix,
                            params.primaryId,
                            params.suffix,
                            params.label,
                            params.fulltext);
        }
        constructor(public kind: string,
                    public finish: number,
                    public prefix: string,
                    public identifier: number,
                    public suffix: string,
                    public label: string,
                    public fulltext: string) {}
        public getFullMessageText(): string {
            return this.fulltext || this.createMessageText();
        }
        private createMessageText(): string {
            return this.createMessageHeader()
            + this.prefix + this.identifier + this.suffix
            + this.createMessageFooter();
        }

        /**
         * abstract
         * @returns {string}
         */
        public createMessageHeader(): string {
            return "";
        }

        /**
         * abstract
         * @returns {string}
         */
        public createMessageFooter(): string {
            return "";
        }
    }
}