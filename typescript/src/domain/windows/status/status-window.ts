/// <reference path="../../../../definitions/jquery.d.ts" />
/// <reference path="../../../infrastructure/window/default/opener.ts" />
/// <reference path="../../../infrastructure/capture/capture.ts" />
/// <reference path="../../../infrastructure/capture/trim.ts" />
/// <reference path="../finder.ts" />

module KCW {

    export class ShipsStatusWindow extends Infra.WindowFrame {
        private static created: ShipsStatusWindow[] = [];
        private instance: any;// Window;
        constructor(params: WinMakeParams, imgURI: string) {
            super(
                ShipsStatusWindow.url() + "?imgURI=" + imgURI,
                "_blank",
                new Infra.WindowPosition(params.coords.left, params.coords.top),
                new Infra.WindowSize(params.size.width, params.size.height)
            );
        }
        public static show(opt: any = {}) {
            var d = $.Deferred();
            WindowFinder.findKCWidget().done((win: chrome.windows.Window) => {
                Infra.Capture.whole(win.id).done((imgURI: string) => {
                    ShipsStatusWindow.trim(imgURI, opt).done((imgURI) => {
                        var params: WinMakeParams = ShipsStatusWindowRepository.local().restore();
                        if (opt.panel) { // opt.panelがある限り、いっこぶん右に表示
                            params.coords.left += params.size.width;
                            imgURI += '&panel=' + opt.panel;
                        }
                        var win = new this(params, imgURI);

                        if (Config.local().get('panelize-ships-status')) {
                          win.size.width = 132;
                          win.size.height = 191;
                          win.openPanel(function(instance) {
                            win.instance = instance;
                            win.register();
                          });
                        } else {
                          win.instance = win.openDefault();
                          win.register();
                        }
                    });
                });
            });
            return d.promise();
        }
        private register() {
            ShipsStatusWindow.created.push(this);
        }
        private close() {
          if (!this.instance) return;
          if (this.instance.close) return this.instance.close();
          if (this.instance.id) return chrome.windows.remove(this.instance.id);
        }
        public static sweep() {
            for (var i = 0; i < ShipsStatusWindow.created.length; i++) {
                ShipsStatusWindow.created[i].close();
            }
            ShipsStatusWindow.created = [];
        }
        private static trim(imgURI: string, opt: any = {}): JQueryPromise<string> {
            var d = $.Deferred();
            ShipsStatusWindow.calcOpenParams(imgURI, opt).done((params) => {
                new Infra.ImageTrimmer(imgURI).trim(params.coords, params.size).done((imgURI) => {
                    d.resolve(imgURI);
                });
            });
            return d.promise();
        }
        private static calcOpenParams(imgURI: string, opt): JQueryPromise<WinMakeParams> {
            var d = $.Deferred();
            opt = $.extend({}, {left:0,top:0,width:0,height:0}, opt);
            var img = new Image();
            img.addEventListener('load', function() {
                var blank = WindowBlank.calculate(img.width, img.height);
                d.resolve({
                    coords : {
                        left : (img.width - blank.width)  * (141/500) + blank.offsetLeft + opt.left,
                        top  : (img.height - blank.height) * (3/8) + blank.offsetTop
                    },
                    size : {
                        width : (img.width - blank.width)  * (43/200),
                        height: (img.height - blank.height) * (7/12)
                    }
                });
            });
            img.src = imgURI;
            return d.promise();
        }
        private static url(): string {
            return chrome.extension.getURL('/') + 'src/html/ships_status.html';
        }
    }
}
