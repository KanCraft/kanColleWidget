/// <reference path="../event.ts" />

module KCW {
    export class Mission extends EventModel {
        public id: number;// 遠征ID
        public title: string;// 遠征名
        constructor(params: EventCreateParams, option: any = {}) {
            super(params);
            this.id = parseInt(option.id);
            this.title = option.title;
        }
        public toPayload(): KCW.API.Payload {
            var payload = super.toPayload();
            payload.event.params.optional = {
                title: this.title,
                missionId: this.id
            };
            return payload;
        }
    }
}
