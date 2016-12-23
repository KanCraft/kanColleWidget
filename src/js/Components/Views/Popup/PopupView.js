import React, {Component,PropTypes} from "react";
import { Client } from "chomex";

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import {SeparatedIDsQueuesView, SeparatedTimelineQueuesView, MergedTimelineView} from "./QueuesView";
import {ScheduledQueues} from "../../Models/Queue/Queue";

// TODO: これ、名前かえような...
import History from "../../Models/History";
import Config  from "../../Models/Config";
import Meta    from "../../Services/Meta";

import IconButton from "material-ui/IconButton";
import ViewModule from "material-ui/svg-icons/action/view-module";
import Schedule   from "material-ui/svg-icons/action/schedule";
import Build      from "material-ui/svg-icons/action/build";
import ChromeReaderMode   from "material-ui/svg-icons/action/chrome-reader-mode";
import {grey400, grey800, red500} from "material-ui/styles/colors";

const ENTER = 13;
const client = new Client(chrome.runtime);

class ReactiveIconButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hovered: false
        };
    }
    render() {
        return (
            <div style={{position:"relative"}}>
              <IconButton
                ref="self"
                style={{position: "relative", transition: "all 1s", ...this.props.style || {}}}
                onClick={this.props.onClick}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                >
                {this.cloneIcon(this.props.children)}
              </IconButton>
              {this.getBadge()}
            </div>
        );
    }
    cloneIcon(icon) {
        return React.cloneElement(icon, {
            style: {transition: "all 1s"},
            color: this.state.hovered ? grey800 : grey400
        });
    }
    onMouseEnter() {
        this.setState({hovered: true});
    }
    onMouseLeave() {
        this.setState({hovered: false});
    }
    getBadge() {
        if (!this.props.badge) return null;
        const txt = (typeof this.props.badge == "string") ? this.props.badge : "";
        return (
          <div style={{position:"absolute",right:"6px",top:"6px",width:"12px",height:"12px",borderRadius:"6px",backgroundColor:red500}}>{txt}</div>
        );
    }
    static propTypes = {
        children: PropTypes.object,
        onClick:  PropTypes.func.isRequired,
        style:    PropTypes.object,
        badge:    PropTypes.any,
    }
}

export default class PopupView extends Component {

    constructor(props) {
        super(props);
        let last = History.find("last-selected-frame");
        this.state = {
            winconfigs: {},
            queues: ScheduledQueues.all(),
            last: last,
            selected: last.id
        };
        this.meta = new Meta(History.find("update-checked"));
        client.message("/frame/all").then(res => {
            this.setState({winconfigs: res.data});
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
    openDashboard() {
        client.message("/window/dashboard");
    }
    openDeckCapture() {
        this.props.context.open("/dest/html/deckcapture.html");
    }
    openOptions() {
        this.props.context.open("/dest/html/options.html");
    }
    openWiki() {
        // TODO: windowオブジェクトを参照するのはいやだなー
        window.open("/dest/html/wiki.html");
    }
    getScheduleView() {
        switch (Config.find("schedule-display-mode").value) {
        case "merged-timeline":    return <MergedTimelineView queues={this.state.queues} />;
        case "separated-timeline": return <SeparatedTimelineQueuesView queues={this.state.queues} />;
        case "separated-ids": default: return <SeparatedIDsQueuesView queues={this.state.queues} />;
        }
    }
    render() {
        let sorted = Object.keys(this.state.winconfigs).filter(id => id != this.state.last.id);
        if (this.state.winconfigs[this.state.last.id]) sorted.unshift(this.state.last.id);
        const winconfigs = Object.keys(this.state.winconfigs).length ? sorted.map(id => {
            const win = this.state.winconfigs[id];
            return <MenuItem key={id} value={id} primaryText={win.alias} />;
        }) : [];
        return (
          <div>
            <SelectField value={this.state.selected} onChange={this.handleChange.bind(this)}>
              {winconfigs}
            </SelectField>
            {this.getScheduleView()}
            <div style={{position:"absolute",bottom:"0",left:"0",right:"0",display:"flex"}}>
              <ReactiveIconButton onClick={this.openOptions.bind(this)} badge={this.meta.hasUpdate()}><Build     /></ReactiveIconButton>
              <ReactiveIconButton onClick={this.openDeckCapture.bind(this)} style={{transform:"rotate(90deg)"}}><ViewModule/></ReactiveIconButton>
              <ReactiveIconButton onClick={this.openWiki.bind(this)}       ><ChromeReaderMode /></ReactiveIconButton>
              <ReactiveIconButton onClick={this.openDashboard.bind(this)}  ><Schedule  /></ReactiveIconButton>
            </div>
          </div>
        );
    }
    static propTypes = {
        context: PropTypes.object.isRequired
    }
}
