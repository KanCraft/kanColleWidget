import {Picture} from "crescent";
import {init} from "../../../entrypoints/global-pollution";
init(window);

// {{{ DEBUG
import WindowService from "../WindowService";
let windows = WindowService.getInstance();
import CaptureService from "../CaptureService";
// import TrimService    from "../TrimService";
const capture = new CaptureService();

import Rectangle from "../Rectangle";

const binarizeThreshold = 200;

class ImageRecognizationService {
    static pics = [];
    constructor() {
    }
    test(params) {
        const dock = params.dock;
        return Promise.resolve()
        .then(() => { return windows.find(true); })
        .then(tab => { return capture.capture(tab.windowId); })
        .then(Image.init)
        .then(img => {
            return new Promise((resolve/* , reject */) => {
                var canvas = document.createElement("canvas");
                var rect = new Rectangle(0, 0, img.width, img.height).removeBlackspace();
                resolve(rect.digitsInRecoveryDock(dock).map(r => {
                    canvas.width = r.width;
                    canvas.height = r.height;
                    canvas.getContext("2d").drawImage(img, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
                    return canvas.toDataURL();
                }));
            });
        })
        .then(fragments => {
            console.log(Picture.init);
            return Promise.all(fragments.map(Picture.init));
        })
        .then(fragments => {
            return Promise.all(fragments.map(fragment => {
                fragment.binarize(binarizeThreshold);
                return fragment.compareTo(...ImageRecognizationService.pics);
            }));
        }).then(results => { // それぞれのfragmentにおける、比較結果が帰ってくる
            return Promise.all(results.map(result => {
                return result.reduce((maxi, x, i, arr) => {
                    return x.score > arr[maxi].score ? i : maxi;
                }, 0); // スコアの高いものだけを抽出
            }));
        });
    }
}

Promise.all([
    new Picture(require("base64-image!../../../../img/x_0.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_1.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_2.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_3.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_4.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_5.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_6.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_7.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_8.png")).initialized,
    new Picture(require("base64-image!../../../../img/x_9.png")).initialized
]).then(pics => {
    ImageRecognizationService.pics = pics.map(pic => pic.binarize(binarizeThreshold));
  // ImageRecognizationService.pics.map(pic => { pic.debug().open(); });
});

export default ImageRecognizationService;
