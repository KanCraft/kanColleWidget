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

    static init(img) {
        return new this(0, 0, img.width, img.height);
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
     * 修復入渠時の、ひとつのドック全体を切り出す座標.
     * おもに、GosseractAPIで用いられる.
     */
    ofRecovery(dock) {
        const start = {
            x: this.x + (this.width/1.29),
            y: this.y + (this.height/3)
        };
        const size = {
            width: this.width/9.4,
            height: this.height/26
        };
        const dockHeight = size.height * 4.4;
        return new Rectangle(
            start.x,
            start.y + ((dock - 1) * dockHeight),
            size.width,
            size.height
        );
    }
    /**
     * 建造時の、ひとつのドック全体を切り出す座標.
     * おもに、GosseractAPIで用いられる.
     */
    ofCreateShip(dock) {
        const start = {
            x: this.x + (this.width/2.00),
            y: this.y + (this.height/2.6)
        };
        const size = {
            width: this.width/9,
            height: this.height/26
        };
        const dockHeight = size.height * 4.236;
        return new Rectangle(
            start.x,
            start.y + ((dock - 1) * dockHeight),
            size.width,
            size.height
        );
    }

  /**
   * 大破進撃防止のあれ
   */
    shipsStatus() {
        return new Rectangle(
      this.x + (this.width/3.561),
      this.y + (this.height/2.7),
      this.width / 4.5,
      this.height / 1.68
    );
    }
    /**
     * 大破進撃で、クリック後にとるやつ、X座標がちょっとちがう
     */
    shipsStatusAfterClick() {
        return new Rectangle(
          this.x + (this.width/4.18),
          this.y + (this.height/2.7),
          this.width / 4.5,
          this.height / 1.68
        );
    }

    /**
     * 修復ドックの座標位置のはなし
     */
    digitsInRecoveryDock(dock) {
        const start = {
            x: this.x + (this.width/1.2845),
            y: this.y + (this.height/2.985)
        };
        const digitWidth = this.width/69.26;
        const digitHeight = this.height/30;
        const dockHeight = digitHeight * 5.093378607809847; // 多分ここなんだよな
        const colonWidth = this.width/140;
        return [0,1,2,3].map(digit => {
            const colon = (digit < 2) ? 0 : colonWidth;
            return new Rectangle(
                start.x + colon + (digit * digitWidth),
                start.y + ((dock - 1) * dockHeight),
                digitWidth,
                digitHeight
            );
        });
    }

  /**
   * 元のRectを、倍率Rectでトランスフォームする
   */
    transform(rate) {
        return new Rectangle(
      this.x + (this.width  * rate.x),
      this.y + (this.height * rate.y),
      this.width * rate.width,
      this.height * rate.height
    );
    }

    isHorizontallyLong() {
        return (this.height / this.width) < Rectangle.aspect.ratio;
    }

    isVerticallyLong() {
        return (this.height / this.width) > Rectangle.aspect.ratio;
    }
}

Rectangle.catalog = {
    // 編成キャプチャのやつ
    defaultDeckcapture: new Rectangle(
      1/2.55,
      1/5,
      1/1.66,
      1/1.285
    ),
    // 基地航空隊の編成キャプチャのやつ
    defaultAviation: new Rectangle(
      72/100,
      22/100,
      27/100,
      73/100
    ),
};

export default Rectangle;
