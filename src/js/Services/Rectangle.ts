import Const from "../Constants";

export enum Aspect {
  Portrait, // オリジナルより縦に長い
  Exact,
  Landscape, // オリジナルより横に長い
}

export default class Rectangle {

  public static new(width: number, height: number): Rectangle {
    return new this(width, height);
  }

  public start: {x: number, y: number} = {x: 0, y: 0};
  public size: {w: number, h: number} = {w: Const.GameWidth, h: Const.GameHeight};

  constructor(w: number, h: number, x: number = 0, y: number = 0) {
    this.size = {w, h};
    this.start = {x, y};
  }

  public game(): Rectangle {
    const r = (this.size.h / this.size.w);
    switch (this.aspect(r)) {
    case Aspect.Landscape:
      return new Rectangle(
        this.size.h / Const.GameAspectRatio,
        this.size.h,
        (this.size.w - (this.size.h / Const.GameAspectRatio)) / 2,
        0,
      );
    case Aspect.Portrait:
      return new Rectangle(
        this.size.w,
        this.size.w * Const.GameAspectRatio,
        0,
        (this.size.h - (this.size.w * Const.GameAspectRatio)) / 2,
      );
    default:
      return this;
    }
  }

  public damagesnapshot(): Rectangle {
    const game = this.game();
    return new Rectangle(
      game.size.w * (5 / 24),
      game.size.h * (103 / 180),
      game.start.x + (game.size.w * (6 / 25)),
      game.start.y + (game.size.h * (7 / 18)),
    );
  }

  public aspect(r = (this.size.h / this.size.w)): Aspect {
    const a = r - Const.GameAspectRatio;
    if (a < 0) {
      return Aspect.Landscape;
    }
    if (a > 0) {
      return Aspect.Portrait;
    }
    return Aspect.Exact;
  }
}
