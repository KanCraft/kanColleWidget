import {init} from "../../../entrypoints/global-pollution";
init(window);

export default class TrimService {
    constructor(dataUrl, mod = chrome) {
        this.url = dataUrl;
        this.module = mod;
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

    getTargetRectPositions(params) {
        const colon = 32;
        const w = 24;
        const h = 162;
        const r = params.dock - 1;
        const offsetY = 320;
        return {
            width:  w,
            height: 38,
            digits: [
                {
                    x: 1244,
                    y: offsetY + h * r,
                },
                {
                    x: 1244 + w,
                    y: offsetY + h * r,
                },
                {
                    x: 1244 + w + colon,
                    y: offsetY + h * r,
                },
                {
                    x: 1244 + w + colon + w,
                    y: offsetY + h * r,
                },
            ]
        };
    }
}
