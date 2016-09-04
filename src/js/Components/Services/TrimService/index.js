export default class TrimService {
  constructor(dataUrl, mod = chrome) {
    this.url = dataUrl;
    this.module = mod;
  }
  trim(parameters) {
    this.canvas = document.createElement('canvas'); // うーん、つらい
    this.img = new Image();
    const p = new Promise(resolve => {
      this.img.onload = () => {
        const params = this.getTargetRectPositions(parameters);
        this.canvas.width  = params.width;
        this.canvas.height = params.height;
        const ctx = this.canvas.getContext('2d');
        const urls = params.digits.map(digit => {
          ctx.drawImage(
            this.img,
            digit.x,      digit.y,       // start of source image
            params.width, params.height, // end of source image
            0,            0,             // start of destination canvas
            params.width, params.height  // end of destination canvas
          );
          // window.open(this.canvas.toDataURL());
          return this.canvas.toDataURL();
        })
        resolve(urls);
      };
    });
    this.img.src = this.url;
    return p;
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
