import React, {Component} from "react";
import {Client} from "chomex";
import {
  RECOVERY,
  CREATESHIP,
} from "../../../Constants";

import {ManualTimerContents} from "../Dashboard/Contents/Dialogs/ManualTimerDialog";
export default class ManualTimerView extends Component {
    constructor(props) {
        super(props);
        this.params = (new URL(location.href)).searchParams;
        window.document.querySelector("title").innerHTML = `${this.title()}タイマー手動登録`;
        this.queue = {
            type: this.params.get("type"),
            identifier: this.params.get("identifier"),
        };
        this.client = new Client(chrome.runtime);
    }
    title() {
        switch(this.params.get("type")) {
        case RECOVERY: return "修復";
        case CREATESHIP: default: return "建造";
        }
    }
    onCommit(time) {
        this.client.message("/queues/manual", {queue: this.queue, time}).then(() => {
            window.close();
        });
    }
    render() {
        const container = {
            width: "240px",
            height: "100px",
            margin: "40px auto",
        };
        return (
          <div style={container}>
            <ManualTimerContents
              queue={this.queue}
              onCancel={() => window.close()}
              onCommit={this.onCommit.bind(this)}
            />
          </div>
        );
    }
}
