/// <reference path="../../../../definitions/jquery.d.ts" />
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
            if (params.text) {
                this.text = params.text;
            } else {
                this.getCurrentText().done((text: string) => {
                    this.text = text;
                });
            }
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
        incrementByCount(count: number) {
            var current: number = parseInt(this.text) || 0;
            if (current + count) this.text = String(current + count);
            else this.text = "";
            this.update();
        }
        private updateText() {
            chrome.browserAction.setBadgeText({text: this.text});
        }
        private updateColor() {
            chrome.browserAction.setBadgeBackgroundColor({color: this.color});
        }
        private getCurrentText(): JQueryPromise<string> {
            var d = $.Deferred();
            chrome.browserAction.getBadgeText({}, (val: String) => {
                d.resolve(val);
            });
            return d.promise();
        }
    }
}