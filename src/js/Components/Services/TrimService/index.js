import {init} from "../../../entrypoints/global-pollution";
init(window);

export default class TrimService {
  constructor(dataUrl, mod = chrome) {
    this.url = dataUrl;
    this.module = mod;
  }
  static init(img) {
    return new this(img.src);
  }
  trim(rect) {
    let dest = document.createElement("canvas"); // うーん、つらい
    return Image.init(this.url).then(img => {
            // 最終的に流し込むキャンバスの大きさを決める
      dest.width  = rect.width;
      dest.height = rect.height;
      dest.getContext("2d").drawImage(
              img,
              // ソースの座標を与える
              rect.x, rect.y, rect.width, rect.height,
              // destの座標を与える
              0, 0, dest.width, dest.height
            );
      return Promise.resolve(dest.toDataURL());
    });
  }
}
