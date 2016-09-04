/**
 * 画像の座標とかをあれこれするやつ
 */
class Rectangle {

  static aspect = { defaultWidth: 800, defaultHeight: 480, ratio: 480/800 };

  constructor(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width  = width;
    this.height = height;
  }

  /**
   * ヨグロ取り除くやつ
   */
  removeBlackspace() {
    if (this.isHorizontallyLong()) {
      let contentWidth = this.height / Rectangle.aspect.ratio;
      let blackspaceWidth = this.width - contentWidth;
      return new Rectangle(
        blackspaceWidth/2, 0,
        contentWidth, this.height
      );
    }
    if (this.isVerticallyLong()) {
      let contentHeight = this.width * Rectangle.aspect.ratio;
      let blackspaceHeight = this.height - contentHeight;
      return new Rectangle(
        0, blackspaceHeight/2,
        this.width, contentHeight
      );
    }
    return new Rectangle(0, 0, this.width, this.height);
  }

  /**
   * 大破進撃防止のあれ
   */
  shipsStatus() {
    return new Rectangle(
      this.x + (this.width/3.57),
      this.y + (this.height/2.7),
      this.width / 4.5,
      this.height / 1.68
    );
  }

  isHorizontallyLong() {
    return (this.height / this.width) < Rectangle.aspect.ratio;
  }

  isVerticallyLong() {
    return (this.height / this.width) > Rectangle.aspect.ratio;
  }
}

export default Rectangle;
