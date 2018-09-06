
export default class Rectangle {
  public static calcZoom(win: Window, original: {width: number, height: number}): number {
    const r = win.innerHeight / win.innerWidth;
    const a = original.height / original.width;
    if (r < a) {
      // 横長なので、高さで決める
      return win.innerHeight / original.height;
    } else {
      // 縦長なので、幅で決める
      return win.innerWidth / original.width;
    }
  }
}
