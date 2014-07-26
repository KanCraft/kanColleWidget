/// <reference path="../event/event.ts" />
module API {
    export class Payload {
        private timestamp: number = Date.now();
        constructor(private event: Event) {}
    }
}