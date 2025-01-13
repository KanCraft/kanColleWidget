// import { Rectangle, load, crop } from "./crop";

/**
 * iframeの中のゲーム画面に対するinjection
 */
(() => {

  const GameRawWidth = 1200;
  const GameRawHeight = 720;

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

  /**
   * 大破進撃防止の画像描画
   */
  class DamageSnapshot {
    /**
     * 戦闘終了後、ユーザのゲーム画面クリックに備え、canvasにクリックイベントを追加する
    **/
    public prepare({ count, timestamp }: { count: number; timestamp: number; }) {
      this.count = count;
      this.timestamp = timestamp;
      this.canvas = window.document.querySelector("canvas")!;
      this.listener = () => {
        if ((Date.now() - timestamp) > this.ignoreMillisecFromBattleResulted) this.onClickNext();
      }
      this.canvas.addEventListener("mousedown", this.listener);
    }
    /**
     * 全体のimage URIを受け取るので、それをトリミングして、表示する
    **/
    public async show({ uri, /* timestamp */ }: { uri: string; timestamp: number; }) {
       
      const raw = await load(uri);
      const rect = new Rectangle(raw.width, raw.height).damagesnapshot();
      const img = await load(await crop(raw, rect));
      img.style.height = "100%";
      if (!this.container) {
        this.container = this.createContainer();
        window.document.body.appendChild(this.container);
      }
      this.container.appendChild(img);
    }
    /**
     * もういらないので、削除する
    **/
    public remove() {
      if (!this.container) {
        this.container = document.querySelector("#kcw-damagesnapshot")!;
      }
      if (this.container && typeof this.container.remove === "function") {
        this.container.remove();
        this.container = null;
      }
    }

    private ignoreMillisecFromBattleResulted = 7800; // 戦闘終了から「次」が登場するまでのミリ秒
    private canvas: HTMLCanvasElement | null = null;
    private container: HTMLDivElement | null = null;
    private count: number = 1; // 何回クリックされたらリセットするか
    private timestamp: number = 0; // drawする画像のkey
    private clicked: number = 0; // 何回クリックされたか
    private listener: (a: unknown) => unknown = () => { };
    private onClickNext() {
      chrome.runtime.sendMessage(chrome.runtime.id, {
        action: "/damage-snapshot/capture", after: 1000 + (800 * this.clicked), timestamp: this.timestamp,
      })
      this.clicked += 1;
      if (this.count <= this.clicked) {
        this.reset();
      }
    }
    private reset() {
      this.clicked = 0;
      this.canvas?.removeEventListener("mousedown", this.listener);
    }
    private createContainer(height: number = 40): HTMLDivElement {
      const div = window.document.createElement("div");
      div.style.height = `${height}%`;
      div.style.position = "fixed";
      div.style.top = "0";
      div.style.left = "0";
      div.style.transition = "all 0.1s";
      div.addEventListener("mouseover", () => div.style.opacity = "1");
      div.addEventListener("mouseout", () => div.style.opacity = "0");
      div.id = "kcw-damagesnapshot";
      // if (this.text) {
      //   div.appendChild(this.additionalText());
      // }
      return div;
    }
  }

  class InAppActionButtons {
    private container: HTMLDivElement;
    private muteButton: HTMLButtonElement;
    private static self: InAppActionButtons | null = null;
    public static create(): InAppActionButtons {
      if (this.self && this.self.container) return this.self;
      this.self = new InAppActionButtons();
      return this.self;
    }
    constructor() {
      this.container = this.createContainer();
      this.muteButton = this.createButton("🔊", () => this.toggleMute());
      this.container.appendChild(this.muteButton);
      window.document.body.appendChild(this.container);
    }
    private async toggleMute() {
      const tab = await chrome.runtime.sendMessage<any, chrome.tabs.Tab>(chrome.runtime.id, { action: "/mute:toggle" })
      this.muteButton.innerHTML = tab.mutedInfo?.muted ? "🔇" : "🔊";
    }
    private createContainer(): HTMLDivElement {
      const div = window.document.createElement("div");
      div.style.position = "fixed";
      div.style.top = "0";
      div.style.right = "0";
      div.style.opacity = "0";
      div.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      div.addEventListener("mouseover", () => div.style.opacity = "0.8");
      div.addEventListener("mouseout", () => div.style.opacity = "0");
      div.id = "kcw-inapp-action-buttons";
      return div;
    }
    private createButton(text: string, onclick = () => { }): HTMLButtonElement {
      const button = window.document.createElement("button");
      button.style.backgroundColor = "#fff";
      button.style.fontSize = "32px";
      button.style.cursor = "pointer";
      button.style.border = "none";
      button.innerHTML = text;
      button.addEventListener("click", onclick);
      return button;
    }
  }

  // 以下、初期化処理
  sessionStorage.setItem("kcw_initialized", "1");

  InAppActionButtons.create();

  const ds = new DamageSnapshot();
  chrome.runtime.onMessage.addListener(async (msg) => {
    switch (msg.__action__) {
    case "/injected/kcs/dsnapshot:prepare":
      return ds.prepare(msg);
    case "/injected/kcs/dsnapshot:show":
      return ds.show(msg);
    case "/injected/kcs/dsnapshot:remove":
      return ds.remove();
    }
  });

})();