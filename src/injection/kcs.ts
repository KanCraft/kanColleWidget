/**
 * iframeの中のゲーム画面に対するinjection
 */
(() => {

  function load(uri: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = uri;
    });
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
      console.log("直接表示できる！", uri);
      const img = await load(uri);
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

  /**
   * 画面内のボタンの描画
   */
  class InAppActionButtons {
    private container: HTMLDivElement;
    private muteButton: HTMLButtonElement;
    private screenshotButton: HTMLButtonElement;
    private static self: InAppActionButtons | null = null;
    public static create(): InAppActionButtons {
      if (this.self && this.self.container) return this.self;
      this.self = new InAppActionButtons();
      return this.self;
    }
    constructor() {
      this.container = this.createContainer();
      this.muteButton = this.createButton("🔊", () => this.toggleMute());
      this.screenshotButton = this.createButton("📷", () => this.screenshot());
      this.container.appendChild(this.screenshotButton);
      this.container.appendChild(this.muteButton);
      window.document.body.appendChild(this.container);
    }

    private async screenshot() {
      this.container.style.display = "none";
      await new Promise(resolve => setTimeout(resolve, 50)); // XXX: なぜか写り込んじゃうので、ちょっと待つ
      await chrome.runtime.sendMessage<{ action: string }, chrome.tabs.Tab>(chrome.runtime.id, { action: "/screenshot" });
      this.container.style.display = "block";
    }

    private async toggleMute() {
      const tab = await chrome.runtime.sendMessage<{ action: string }, chrome.tabs.Tab>(chrome.runtime.id, { action: "/mute:toggle" })
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