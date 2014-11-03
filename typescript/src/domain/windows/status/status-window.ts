/// <reference path="../../../../definitions/jquery.d.ts" />
/// <reference path="../../../infrastructure/window/default/opener.ts" />
/// <reference path="../../../infrastructure/capture/capture.ts" />
/// <reference path="../../../infrastructure/capture/trim.ts" />
/// <reference path="../finder.ts" />

module KCW {

    export class ShipsStatusWindow extends Infra.WindowFrame {
        private static created: ShipsStatusWindow[] = [];
        private instance: Window;
        constructor(params: WinMakeParams, imgURI: string) {
            super(
                ShipsStatusWindow.url() + "?imgURI=" + imgURI,
                "_blank",
                new Infra.WindowPosition(params.coords.left, params.coords.top),
                new Infra.WindowSize(params.size.width, params.size.height)
            );
        }
        public static show() {
            var d = $.Deferred();
            WindowFinder.findKCWidget().done((win: chrome.windows.Window) => {
                Infra.Capture.whole(win.id).done((imgURI: string) => {
                    imgURI = ShipsStatusWindow.trim(imgURI);
                    var params: WinMakeParams = ShipsStatusWindowRepository.local().restore();
                    var win = new this(params, imgURI);
                    win.instance = win.open();
                    win.register();
                });
            });
            return d.promise();
        }
        private register() {
            ShipsStatusWindow.created.push(this);
        }
        private close() {
            if (this.instance && this.instance.close) this.instance.close();
        }
        public static sweep() {
            for (var i = 0; i < ShipsStatusWindow.created.length; i++) {
                ShipsStatusWindow.created[i].close();
            }
            ShipsStatusWindow.created = [];
        }
        private static trim(imgURI: string): string {
            var params = ShipsStatusWindow.calcOpenParams(imgURI);
            return new Infra.ImageTrimmer(imgURI).trim(params.coords, params.size);
        }
        private static calcOpenParams(imgURI: string): WinMakeParams {
            var img = new Image();
            img.src = imgURI;
            var blank = WindowBlank.calculate(img.width, img.height);
            return {
                coords : {
                    left : (img.width - blank.width)  * (141/500) + blank.offsetLeft,
                    top  : (img.height - blank.height) * (3/8) + blank.offsetTop
                },
                size : {
                    width : (img.width - blank.width)  * (43/200),
                    height: (img.height - blank.height) * (7/12)
                }
            };
        }
        private static url(): string {
            return chrome.extension.getURL('/') + 'src/html/ships_status.html';
        }
    }
}