import React, {Component,PropTypes} from "react";
import { Client } from "chomex";

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import QueuesView from "./QueuesView";

// TODO: これ、名前かえような...
import History from "../../Models/History";

const ENTER = 13;
const client = new Client(chrome.runtime);

export default class PopupView extends Component {

    constructor(props) {
        super(props);
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
        this.props.context.document.addEventListener("keydown", (ev) => {
            if (ev.which != ENTER) return;
            ev.preventDefault();
            client.message({act: "/window/open", frame: this.state.selected});
        });
    }
    handleChange(ev, index, selected) {
        this.setState({selected});
        client.message({act: "/window/open", frame: selected}, true);
    }
    openDeckCapture() {
        this.props.context.open("/dest/html/deckcapture.html");
    }
    openOptions() {
        this.props.context.open("/dest/html/options.html");
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
            <FlatButton label="編成キャプチャ" onClick={this.openDeckCapture.bind(this)} />
            <FlatButton label="詳細設定" onClick={this.openOptions.bind(this)} />
          </div>
        );
    }
    static propTypes = {
        context: PropTypes.object.isRequired
    }
}
