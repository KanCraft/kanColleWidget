import {init} from "../../../entrypoints/global-pollution";
init(window);

class ImageRecognizationService {

}

// import {Picture} from "crescent";
// import WindowService from "../WindowService";
// let windows = WindowService.getInstance();
// import CaptureService from "../CaptureService";
// const capture = new CaptureService();
//
// import Rectangle from "../Rectangle";
//
// const binarizeThreshold = 200;
//
// class ImageRecognizationService {
//     static pics = [];
//     constructor(purpose, dock) {
//         this.purpose = purpose;
//         this.dock    = dock;
//     }
//     test() {
//         return Promise.resolve()
//         .then(this.findKanColleWindow)
//         .then(this.captureWindow)
//         .then(Image.init)
//         .then(this.getFragmentsRectangles.bind(this))
//         .then(this.initializedPicturesFromFragmentsImageURI)
//         .then(this.binarizeAllFragmentPictures)
//         .then(this.compareAllFragmentPicturesToPreparedModels)
//         .then(this.pickupTheBestScoreForEachFragmentPicture)
//         .then(this.parseDigitsToTimeAmount);
//     }
//
//     findKanColleWindow() {
//         return windows.find(true);
//     }
//     captureWindow(tab) {
//         return capture.capture(tab.windowId);
//     }
//     getFragmentsRectangles(img) {
//         return new Promise((resolve/* , reject */) => {
//             var canvas = document.createElement("canvas");
//             var rect = new Rectangle(0, 0, img.width, img.height).removeBlackspace();
//             resolve(rect.digitsInRecoveryDock(this.dock).map(r => {
//                 canvas.width = r.width;
//                 canvas.height = r.height;
//                 canvas.getContext("2d").drawImage(img, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
//                 return canvas.toDataURL();
//             }));
//         });
//     }
//     initializedPicturesFromFragmentsImageURI(fragments) {
//         return Promise.all(fragments.map(Picture.init));
//     }
//     binarizeAllFragmentPictures(pictures) {
//         return Promise.resolve(pictures.map(pic => {
//             return pic.binarize(binarizeThreshold);
//         }));
//     }
//     compareAllFragmentPicturesToPreparedModels(pictures) {
//         return Promise.all(pictures.map(pic => {
//             return pic.compareTo(...ImageRecognizationService.pics);
//         }));
//     }
//     pickupTheBestScoreForEachFragmentPicture(results) {
//         return Promise.all(results.map((result /*, idx */) => {
//             // if (idx == 0) result.debug(window);
//             return result.reduce((maxi, x, i, arr) => {
//                 return x.score > arr[maxi].score ? i : maxi;
//             }, 0); // スコアの高いものだけを抽出
//         }));
//     }
//     parseDigitsToTimeAmount(digits) {
//         return Promise.resolve({
//             hours: digits[0] * 10 + digits[1],
//             minutes: digits[2] * 10 + digits[3]
//         });
//     }
// }
//
// Promise.all([
//     new Picture(require("base64-image!../../../../img/x_0.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_1.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_2.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_3.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_4.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_5.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_6.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_7.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_8.png")).initialized,
//     new Picture(require("base64-image!../../../../img/x_9.png")).initialized
// ]).then(pics => {
//     ImageRecognizationService.pics = pics.map(pic => pic.binarize(binarizeThreshold));
//   // ImageRecognizationService.pics.map(pic => { pic.debug().open(); });
// });
//
export default ImageRecognizationService;
