import WindowService from '../../Services/WindowService';
import CaptureService from '../../Services/CaptureService';
import Rectangle from '../../Services/Rectangle';
const windows = WindowService.getInstance();
const capture = new CaptureService();

// TODO: これどっかにやる
const initImage = (uri) => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = uri;
  });
}
// TODO: これもどっかにやる
const sleep = (seconds) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export function onBattleResulted(detail) {
  sleep(3.1).then(windows.find.bind(windows)).then(tab => {
    return capture.capture(tab.windowId);
  }).then(initImage).then(img => {
    // ここの、「全体のURIをもらって、Rectを決めて、URIをconvertする」っていうの、ルーチンなのでどっかにやる
    let rect = (new Rectangle(0, 0, img.width, img.height)).removeBlackspace().shipsStatus();
    let canvas = document.createElement('canvas');
    canvas.width = rect.width; canvas.height = rect.height;
    canvas.getContext('2d').drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    return Promise.resolve(canvas.toDataURL());
  }).then(uri => {
    window.open(uri); // あとはこれ使ってどうにかする
  })
}
