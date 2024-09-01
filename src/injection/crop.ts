(() => {

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  if ((window as any)["KanColleWidget"]) {
    console.warn("KanColleWidget is already defined.");
    return;
  }

  const GameRawWidth = 1200;
  const GameRawHeight = 720;

  // FIXM: このクラス、いろんなところで使ってるので、どこかに移動したい
  class Rectangle {
    public size: { w: number, h: number };
    public start: { x: number, y: number };
    constructor(w: number, h: number, x = 0, y = 0) {
      this.size = { w, h };
      this.start = { x, y };
    }
    public static new(bounds: { width: number, height: number }): Rectangle {
      return new Rectangle(bounds.width, bounds.height);
    }
    public game(): Rectangle {
      const a = this.size.h / this.size.w;
      const r = GameRawHeight / GameRawWidth;
      if (a - r > 0) return new Rectangle(this.size.w, this.size.w * r, 0, (this.size.h - (this.size.w * r)) / 2); // タテなが
      else if (a - r < 0) return new Rectangle(this.size.h / r, this.size.h, (this.size.w - (this.size.h / r)) / 2, 0); // ヨコなが
      return this;
    }
    public purpose(purpose: string, params: Record<string, unknown> = {}): Rectangle {
      switch (purpose) {
      case "recovery": return this.recovery();
      case "shipbuild": return this.shipbuild(params.dock as number);
      default: return this.recovery();
      }
    }
    public recovery(): Rectangle {
      const g = this.game();
      return new Rectangle(
        g.size.w * (1 / 8),
        g.size.h * (36 / 720),
        g.start.x + (g.size.w * (55 / 100)),
        g.start.y + (g.size.h * (57 / 100)),
      );
    }
    public shipbuild(dock: number): Rectangle {
      const g = this.game();
      // ドックひとつずれたときのY開始位置
      const dockOffset = g.size.h * (120 / 720);
      return new Rectangle(
        g.size.w * (148 / 1200),
        g.size.h * (32 / 720),
        g.start.x + (g.size.w * (592 / 1200)),
        g.start.y + (g.size.h * (268 / 720)) + ((dock - 1) * dockOffset),
      );
    }
    public damagesnapshot(): Rectangle {
      const g = this.game();
      return new Rectangle(
        g.size.w * (5 / 24),
        g.size.h * (103 / 180),
        g.start.x + (g.size.w * (6 / 25)),
        g.start.y + (g.size.h * (7 / 18)),
      );
    }
  }

  function load(uri: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = uri;
    });
  }

  function crop(image: HTMLImageElement, rect: Rectangle): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = rect.size.w;
    canvas.height = rect.size.h;
    ctx.drawImage(image, rect.start.x, rect.start.y, rect.size.w, rect.size.h, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.5);
  }

  const KanColleWidget = {
    crop,
    load,
    Rectangle,
  };
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  (window as any)["KanColleWidget"] = KanColleWidget;
})();
