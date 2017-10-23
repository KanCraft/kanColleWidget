import {init} from "../../entrypoints/global-pollution";
init(window);

export default class TrimService {
  constructor(dataUrl, mod = chrome) {
    this.url = dataUrl;
    this.module = mod;
  }
  static init(img) {
    return new this(img.src);
  }
  static initWithURI(uri) {
    return new this(uri);
  }
  trim(rect, pure = false) {
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
      let url = dest.toDataURL();
      if (pure) url = url.replace(/data:image\/[png|jpeg|gif];base64,/, "");
      return Promise.resolve(url);
    });
  }
  /**
   * 画像をそのままリサイズする
   * 引数が無い場合は、デフォルトの中型サイズにする
   */
  resize(params = {width:800,height:480,rate:null}) {
    let dest = document.createElement("canvas");
    return Image.init(this.url).then(img => {
      // 最終的に流し込むキャンバスの大きさを決める
      try {
        const size = (params.rate != null) ? {
          width:  img.width  * params.rate,
          height: img.height * params.rate,
        } : {
          width:  params.width,
          height: params.height,
        };

        dest.width  = size.width;
        dest.height = size.height;
        dest.getContext("2d").drawImage(
          img,
          // ソースの座標を与える
          0, 0, img.width, img.height,
          // destの座標を与える
          0, 0, dest.width, dest.height
        );
        let url = dest.toDataURL();
        return Promise.resolve(url);
      } catch (err) {
        console.log("NG?", err);
      }
    });
  }
}
