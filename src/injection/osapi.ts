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
    public async show({ uri, heightRatio, label, timestamp }: { uri: string; heightRatio?: number; label?: string | null; timestamp: number; }) {
      const img = await load(uri);
      // 高さを具体値(vh)にする。height:100% にすると画像の自然解像度幅がコンテナ幅に
      // 採用されて巨大化するため、vh で高さを与えて幅はアスペクト比に委ねる。
      img.style.height = `${heightRatio ?? 40}vh`;
      img.style.width = "auto";
      img.style.display = "inline-block";
      img.style.verticalAlign = "top";
      // 新しいスナップショット（timestamp が変わった）なら、ここで初めて前回の窓を消して作り直す。
      // 同じ timestamp（連合艦隊の2ペイン目）は消さずに横へ追記する。これにより「戦闘開始では消さず、
      // 次の窓を出すこのタイミングで差し替える」が成立する（前の窓を粘らせる設定の実体）。
      if (this.container && this.shownTimestamp !== timestamp) {
        this.remove();
      }
      if (!this.container) {
        this.container = this.createContainer(label);
        this.shownTimestamp = timestamp;
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
    private shownTimestamp: number | undefined; // 現在表示中の窓がどの戦闘(timestamp)のものか
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
    private createContainer(label?: string | null): HTMLDivElement {
      const div = window.document.createElement("div");
      div.style.position = "fixed";
      div.style.top = "0";
      div.style.left = "0";
      div.style.transition = "all 0.1s";
      div.style.opacity = "1";
      div.style.boxSizing = "border-box";
      div.style.whiteSpace = "nowrap"; // 連合艦隊の複数ペインを横一列に保つ
      div.style.fontSize = "0";        // inline-block 画像間の余白を消す
      // v3 と同じく「海域 (連戦数) ラベルを1行 → その下に画像」にする（画像に重ねない）。
      // 帯は絶対配置で画像幅いっぱい(left:0/right:0)に広げ、画像側は上端に帯ぶんの余白を空けて下げる。
      // min-width:max-content で、画像が細くても海域名テキストが切れないようにする。
      if (label) {
        div.style.paddingTop = "22px";
        const tag = window.document.createElement("div");
        tag.textContent = label;
        tag.style.cssText = "position:absolute;top:0;left:0;right:0;min-width:max-content;box-sizing:border-box;background:rgba(0,0,0,0.8);color:#fff;font-size:12px;line-height:1.4;padding:2px 6px;white-space:nowrap;";
        div.appendChild(tag);
      }
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
