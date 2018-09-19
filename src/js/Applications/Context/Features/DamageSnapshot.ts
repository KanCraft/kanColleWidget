import { Client } from "chomex/lib/Client";

export default class DamageSnapshot {

  private client: Client;
  private canvas: HTMLCanvasElement;
  private container: HTMLDivElement = null;
  private listener: () => any;

  private count: number = 1;
  private clicked: number = 0;

  constructor(private scope: Window) {
    this.client = new Client(chrome.runtime);
  }

  /**
   * 「次」ボタンが押されるイベントを貼る
   */
  public prepare(count: number = 1) {
    this.count = count;
    const canvas = this.scope.document.querySelector("canvas");
    this.canvas = canvas;
    this.listener = () => this.onClickNext();
    canvas.addEventListener("mousedown", this.listener);
  }

  /**
   * Image URI を受け取るので、どっかにこれを表示する
   */
  public show(uri: string) {
    if (this.container === null) {
      this.container = this.createContainer();
      this.scope.document.body.appendChild(this.container);
    }
    const img = this.createImage(uri);
    this.container.appendChild(img);
  }

  /**
   * もう表示しなくていいので消す
   */
  public remove() {
    if (this.container && typeof this.container.remove === "function") {
      this.container.remove();
      this.container = null;
    }
  }

  private onClickNext() {
    this.client.message("/snapshot/capture", {after: 1000 + (200 * this.clicked)});
    this.clicked += 1;
    if (this.count <= this.clicked) {
      this.reset();
    }
  }

  private reset() {
      this.clicked = 0;
      this.canvas.removeEventListener("mousedown", this.listener);
  }

  private createContainer(): HTMLDivElement {
    const div = this.scope.document.createElement("div");
    div.style.height = "200px";
    div.style.backgroundColor = "green";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.transition = "all 0.1s";
    div.addEventListener("mouseover", () => div.style.opacity = "1");
    div.addEventListener("mouseout", () => div.style.opacity = "0");
    div.id = "kcw-damagesnapshot";
    return div;
  }

  private createImage(uri: string): HTMLImageElement {
    const img = this.scope.document.createElement("img");
    img.src = uri;
    img.style.height = "100%";
    return img;
  }

}
