import React, { Component, Fragment } from "react";
import * as chomex from "chomex";
import Frame from "../../Models/Frame";

export default class LaunchTrigger extends Component<{}, {frames: Frame[], selected: Frame}> {
  private client = new chomex.Client(chrome.runtime);
  constructor(props) {
    super(props);
    this.state = {
      frames: Frame.list<Frame>(),
      selected: Frame.latest(),
    }
  }
  render() {
    return (
      <div className="columns">
        <div className="column col-10">
          <div className="form-group">
            <select onSelect={ev => this.onSelect(ev)} className="form-select" style={{appearance: "none"}}>
              {this.state.frames.map(f => <option key={f.id} value={f.id} selected={f.id == this.state.selected.id}>{f.alias}</option>)}
            </select>
          </div>
        </div>
        <div className="column col-2">
          <div
              // @click="launch"
              className="icon-justify clickable">
              <img src="/dest/img/anchor.svg" width="30px" alt="抜錨！" title="抜錨！" />
          </div>
        </div>
      </div>
    );
  }
  onSelect(ev) {
    this.client.message("/window/open", {id: ev.target.value}).then(() => {
      // FIXME: ここでWindowを参照したくなかった
      window.close();
    });
  }
  launch() {
    this.client.message("/window/open", {id: this.state.selected._id}).then(() => {
      // FIXME: ここでWindowを参照したくなかった
      window.close();
    });
  }
}
