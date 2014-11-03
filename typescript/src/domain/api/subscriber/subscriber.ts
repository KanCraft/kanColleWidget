
module KCW {
    export class Subscriber {
        constructor(public id: string) {}
        toURL(): string {
            return "https://chrome.google.com/webstore/detail/" + this.id;
        }
    }
}