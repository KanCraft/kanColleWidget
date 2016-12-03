import React, { Component } from "react";
import { Client } from "chomex";

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import QueuesView from "./QueuesView";

import History from "../../Models/History";

// const url = "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/";

const ENTER = 13;
const client = new Client(chrome.runtime);

// const DefaultWhiteWindow = {
//     id: "__white",
//     alias: "WHITE (default size)",
//     url: url,
//     decoration: "FRAME_SHIFT",
//     size: {width: 800, height: 480}
// };

export default class PopupView extends Component {

    constructor() {
        super();
        let last = History.find("last-selected-frame");
        this.state = {
            winconfigs: {},
            queues:     {
                missions: {queues: []}, recoveries: {queues: []}, createships: {queues: []}
            },
            last: last,
            selected: last.id
        };

        client.message("/frame/all").then(res => {
            this.setState({winconfigs: res.data});
        });
        client.message("/queues/get", {key: "all"}).then(res => {
            this.setState({queues: res.data});
        });
    }

    componentDidMount() {
    // お、いきなりwindowを参照しましたね！
        window.document.addEventListener("keydown", (ev) => {
            if (ev.which != ENTER) return;
            client.message({act: "/window/open", win: this.state.winconfigs[this.state.selected]})
        .then(res => console.log("エンターキーのやつ", res));
        });
    }

    handleChange(ev, index, selected) {
        this.setState({selected});
        client.message({act: "/window/open", frame: selected}, true);
      // .then(res => console.log('/window/open, ok', res))
      // .catch(err => console.log('/window/open, ng', err));
    }

    render() {

        let sorted = Object.keys(this.state.winconfigs).filter(id => id != this.state.last.id);
        sorted.unshift(this.state.last.id);
        const winconfigs = Object.keys(this.state.winconfigs).length ? sorted.map(id => {
            const win = this.state.winconfigs[id];
            return <MenuItem key={id} value={id} primaryText={win.alias} />;
        }) : [];

        return (
      <div>
        <SelectField value={this.state.selected} onChange={this.handleChange.bind(this)}>
          {winconfigs}
        </SelectField>
        <QueuesView queues={this.state.queues} />
        <FlatButton label="編成キャプチャ" onClick={() => {
            // TODO: とりあえずwindow.openでいいや
            window.open("/dest/html/deckcapture.html");
        }} />
        <FlatButton label="詳細設定" onClick={() => {
            // TODO: とりあえずwindow.openでいいや
            window.open("/dest/html/options.html");
        }} />
      </div>
    );
    }
}
