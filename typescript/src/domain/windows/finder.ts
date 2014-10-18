/// <reference path="../../../definitions/jquery.d.ts" />
/// <reference path="../../../definitions/chrome.d.ts" />
/// <reference path="../../infrastructure/window/detector.ts" />

module KCW {
    export class WindowFinder {
        private static kcwExp: RegExp = /^http:\/\/osapi.dmm.com\/gadgets\/ifr/;
        private static dmmExp: RegExp = /^http:\/\/www.dmm.com\/.+\/app_id=854854/;
        public static findKCWidget(): JQueryPromise<chrome.windows.Window> {
            return Infra.detectWindow([WindowFinder.kcwExp, WindowFinder.dmmExp]);
        }
    }
}