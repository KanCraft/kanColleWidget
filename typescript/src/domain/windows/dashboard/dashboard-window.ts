/// <reference path="../../../../definitions/jquery.d.ts" />
/// <reference path="../../../infrastructure/window/default/opener.ts" />
/// <reference path="../../../infrastructure/capture/capture.ts" />
/// <reference path="../../../infrastructure/capture/trim.ts" />
/// <reference path="../finder.ts" />

module KCW {
    export class DashboardWindow extends Infra.WindowFrame {
        constructor(width: number, height: number, left: number, top: number, options: Object = {}) {
            super(
                DashboardWindow.url(),
                "_blank",
                new Infra.WindowPosition(left, top),
                new Infra.WindowSize(width, height),
                options
            );
        }
        /**
         * どっちか決めてアレする
         */
        public open(cb: (any) => any): any /* TODO: adjustWindowsもできるようにする */ {
            switch(Config.local().get('dashboard-type')) {
                case true:
                    return this.openPanel(cb);// うーん、ここはwindowじゃない
                default:
                    return cb(this.openDefault());
            }
        }

        private static url(): string {
            return chrome.extension.getURL('/') + 'src/html/dashboard.html';
        }
    }
}