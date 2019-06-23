import React, { Component } from "react";

import { Client } from "chomex";
import TempStorage from "../../../Services/TempStorage";


export default class DamageSnapshot extends Component<{}, {
  count: number;
  text?: string;
  uris: string[];
}> {

  private client: any = new Client(chrome.runtime);
  private observe: number;
  private record: number;
  private key: string;

  constructor(props) {
    super(props);
    const search = new URLSearchParams(location.search);
    const count = parseInt(search.get("count") || "1", 10);
    const text = search.get("text");
    this.key = search.get("key");
    this.observe = setInterval(() => this.renderImage(), 100);
    this.record = setInterval(() => this.recordFrame(), 2000);
    this.state = {count, text, uris: []};
  }
  /**
   * ローカルストレージを監視し、自分のkeyでuriが保存されたら、
   * それを引き出して表示する。
   * 初期化で使われた "count" に至れば、もうこれ以上同じことはしない。
   */
  private renderImage() {
    const temp = new TempStorage();
    const uri = temp.draw(`damagesnapshot_${this.key}`);
    if (!uri) {
      return;
    }
    this.setState({ uris: this.state.uris.concat([uri]) });
    if (this.state.uris.length >= this.state.count) {
      clearInterval(this.observe);
    }
  }
  private recordFrame() {
    this.client.message("/snapshot/record", {
      position: { left: window.screenLeft, top: window.screenTop },
      size: { height: window.innerHeight },
    });
  }
  render() {
    const {text, uris} = this.state;
    return (
      <div className="container">
        {text ? <div className="additional-information">{text}</div> : null}
        <div className="row">
          {uris.map((uri, i) => <div
            className="cell"
            key={i}
            style={{backgroundImage: `url(${uri})`}}
            ></div>)}
        </div>
      </div>
    );
  }
}
