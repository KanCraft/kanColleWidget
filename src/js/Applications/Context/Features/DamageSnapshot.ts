import { Client } from "chomex";

export default class DamageSnapshot {

  private client: Client;
  private canvas: HTMLCanvasElement;
  private container: HTMLDivElement = null;
  private listener: () => any;

  private count = 1;
  private key: string; // drawする画像を間違えないようにするkey
  private text: string; // なんか付随して表示する情報。おもにSortie.context()
  private clicked = 0;

  constructor(private scope: Window) {
    this.client = new Client(chrome.runtime);
  }

  private onClickNext() {
    this.client.message("/snapshot/capture", {after: 1000 + (800 * this.clicked), key: this.key});
    this.clicked += 1;
    if (this.count <= this.clicked) {
      this.reset();
    }
  }

  private reset() {
    this.clicked = 0;
    this.canvas.removeEventListener("mousedown", this.listener);
  }

  private createContainer(height: number): HTMLDivElement {
    const div = this.scope.document.createElement("div");
    div.style.height = `${height}%`;
    div.style.backgroundColor = "green";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.transition = "all 0.1s";
    div.addEventListener("mouseover", () => div.style.opacity = "1");
    div.addEventListener("mouseout", () => div.style.opacity = "0");
    div.id = "kcw-damagesnapshot";
    if (this.text) {
      div.appendChild(this.additionalText());
    }
    return div;
  }

  private additionalText(): HTMLDivElement {
    const div = this.scope.document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.right = "0";
    div.style.fontSize = "2vh";
    div.style.color = "white";
    div.style.padding = "0 4px";
    div.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    div.style.whiteSpace = "nowrap";
    div.id = "kcw-damagesnapshot-additional-information";
    div.innerText = this.text;
    return div;
  }

  private createImage(uri: string): HTMLImageElement {
    const img = this.scope.document.createElement("img");
    img.src = uri;
    img.style.height = "100%";
    return img;
  }

  /**
   * 「次」ボタンが押されるイベントを貼る
   */
  prepare(m: {count: number; key: number; text: string}) {
    this.count = m.count;
    this.key = String(m.key);
    this.text = m.text;
    const canvas = this.scope.document.querySelector("canvas");
    this.canvas = canvas;
    this.listener = () => this.onClickNext();
    canvas.addEventListener("mousedown", this.listener);
  }

  /**
   * Image URI を受け取るので、どっかにこれを表示する
   */
  show(message: {uri: string; height: number}) {
    if (this.container === null) {
      this.container = this.createContainer(message.height);
      this.scope.document.body.appendChild(this.container);
    }
    const img = this.createImage(message.uri);
    this.container.appendChild(img);
  }

  /**
   * もう表示しなくていいので消す
   */
  remove() {
    if (this.container && typeof this.container.remove === "function") {
      this.container.remove();
      this.container = null;
    }
  }

}
