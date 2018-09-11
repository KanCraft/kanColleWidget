import { Client } from "chomex/lib/Client";

export default class DamageSnapshot {

  private client: Client;
  private canvas: HTMLCanvasElement;
  private listener: () => any;

  constructor(private scope: Window) {
    this.client = new Client(chrome.runtime);
  }

  /**
   * 「次」ボタンが押されるイベントを貼る
   */
  public prepare() {
    const canvas = this.scope.document.querySelector("canvas");
    this.canvas = canvas;
    this.listener = () => this.onClickNext();
    canvas.addEventListener("mousedown", this.listener);
  }

  /**
   * Image URI を受け取るので、どっかにこれを表示する
   */
  public show(uri: string) {
    // なんかやる
  }

  public remove() {
    // なんかやる
  }

  private onClickNext() {
    this.client.message("/snapshot/capture").then(res => {
      // TODO: clientのresでは受けないで、showで受けたい
      /* tslint:disable no-console */
      console.log(res);
    });
    this.canvas.removeEventListener("mousedown", this.listener);
  }

}
