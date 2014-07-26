module API {
    export class Subscriber {
        constructor(private extId: string) {}
        public getId(): string {
            return this.extId;
        }
        public toJSON(): Object {
            return {
                extId: this.extId
            };
        }
    }
}
