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
    public async show({ uri, heightRatio, /* timestamp */ }: { uri: string; heightRatio?: number; timestamp: number; }) {
      const img = await load(uri);
      const actualHeightRatio = heightRatio ?? 40;
      const canvasHeight = this.canvas?.clientHeight || 720;
      img.style.height = `${canvasHeight * actualHeightRatio / 100}px`;
      img.style.width = "auto";
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
    private createContainer(): HTMLDivElement {
      const div = window.document.createElement("div");
      div.style.position = "fixed";
      div.style.top = "0";
      div.style.left = "0";
      div.style.transition = "all 0.1s";
      div.style.opacity = "1";
      let autoHideTimer: number | null = null;
      const clearAutoHide = () => {
        if (autoHideTimer !== null) {
          window.clearTimeout(autoHideTimer);
          autoHideTimer = null;
        }
      };
      const armAutoHide = () => {
        clearAutoHide();
        autoHideTimer = window.setTimeout(() => {
          if (div.matches(":hover")) {
            armAutoHide();
            return;
          }
          div.style.opacity = "0";
          autoHideTimer = null;
        }, 2000);
      };
      const showOverlay = () => {
        div.style.opacity = "1";
        armAutoHide();
      };
      const hideOverlay = () => {
        clearAutoHide();
        div.style.opacity = "0";
      };
      div.addEventListener("pointerenter", showOverlay);
      div.addEventListener("pointerleave", hideOverlay);
      div.id = "kcw-damagesnapshot";
      // if (this.text) {
      //   div.appendChild(this.additionalText());
      // }

      // FIXME: /injected/kcs/dsnapshot:remove が正しく発火せずに
      //        大破進撃防止窓が消えないことがあるので、いったんクリックで消すようにする
      //        @see https://x.com/jumbo762/status/1899076594377039923
      div.addEventListener("click", () => window.confirm("この大破確認窓を消しますか？") ? this.remove() : null);
      return div;
    }
  }

  // 以下、初期化処理
  sessionStorage.setItem("kcw_initialized", "1");

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
