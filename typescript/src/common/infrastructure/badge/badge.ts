/// <reference path="../../../../definitions/chrome.d.ts" />
/// <reference path="../../domain/event/event-factory.ts" />

module KCW {
    export interface BadgeParams {
        text?: string;
        color?: string;
    }
    export class Badge {
        public text: string = "";
        public color: string = "#0FABB1";
        constructor(params: BadgeParams = {}) {
            if (params.text) this.text = params.text;
            if (params.color) this.color = params.color;
        }
        setText(text: string) {
            this.text = text;
        }
        setColor(colorCode: string) {
            this.color = colorCode;
        }
        show() {
            this.update();
        }
        clear() {
            this.text = "";
            this.color = "";
            this.update();
        }
        update() {
            this.updateColor();
            this.updateText();
        }
        private updateText() {
            chrome.browserAction.setBadgeText({text: this.text});
        }
        private updateColor() {
            chrome.browserAction.setBadgeBackgroundColor({color: this.color});
        }
    }
}