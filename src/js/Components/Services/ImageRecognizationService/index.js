import {Picture} from 'crescent';

// {{{ DEBUG
import WindowService from '../WindowService';
let windows = WindowService.getInstance();
import CaptureService from '../CaptureService';
import TrimService    from '../TrimService';
const capture = new CaptureService();

class ImageRecognizationService {
  static pics = [];
  constructor() {
  }
  test(params) {
    return Promise.resolve()
    .then(() => {
      return windows.find(true); // ターゲット画面を取得
    })
    .then(tab => {
      return capture.capture(tab.windowId) // ターゲット全体画像を取得
    })
    .then(uri => {
      const trim = new TrimService(uri);
      return trim.trim(params); // ターゲット数字画像を分割して取得
    })
    .then(res => {
      return Promise.all(res.map(uri => {
        return (new Picture(uri)).initialized // ターゲット数字画像を初期化
      }));
    }).then(targets => {
      return Promise.all(targets.map(target => {
        target.binarize(200); // ターゲットを二値化
        return target.compareTo(...ImageRecognizationService.pics);
      }));
    }).then(results => {
      return Promise.all(results.map(result => {
        return result.reduce((maxi, x, i, arr) => {
          return x.score > arr[maxi].score ? i : maxi
        }, 0); // スコアの高いものだけを抽出
      }));
    });
  }
}

Promise.all([
  new Picture(require('base64-image!../../../../img/x_0.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_1.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_2.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_3.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_4.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_5.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_6.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_7.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_8.png')).initialized,
  new Picture(require('base64-image!../../../../img/x_9.png')).initialized
]).then(pics => {
  ImageRecognizationService.pics = pics.map(pic => pic.binarize(200));
});

export default ImageRecognizationService;
