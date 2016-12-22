import React, {Component,PropTypes} from "react";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Settings           from "material-ui/svg-icons/action/settings";
import SelectField        from "material-ui/SelectField";
import MenuItem           from "material-ui/MenuItem";

import {SeparatedIDsQueuesView, SeparatedTimelineQueuesView, MergedTimelineView} from "../../../Popup/QueuesView";
import {ScheduledQueues}        from "../../../../Models/Queue/Queue";
import Config                   from "../../../../Models/Config";

class TimerExample extends Component {
    constructor(props) {
        super(props);
        this.queues = ScheduledQueues.all();
    }
    getSeparatedIdentifiers() {
        return <SeparatedIDsQueuesView queues={this.queues} />;
    }
    getSeparatedTimeline() {
        return <SeparatedTimelineQueuesView queues={this.queues} />;
    }
    getMergedTimeline() {
        return <MergedTimelineView queues={this.queues} />;
    }
    getList() {
        switch (this.props.mode) {
        case "merged-timeline":        return this.getMergedTimeline();
        case "separated-timeline":     return this.getSeparatedTimeline();
        case "separated-ids": default: return this.getSeparatedIdentifiers();
        }
    }
    render() {
        return (
            <div>
              {this.getList()}
            </div>
        );
    }
    static propTypes = {
        mode:   PropTypes.string.isRequired,
        format: PropTypes.string.isRequired,
    }
}

export default class TimerSettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: Config.find("schedule-display-mode"),
            dashboard: Config.find("schedule-display-mode-dashboard"), // FIXME: うえで`model`つかっちゃってるからなあw
            timefmt: Config.find("time-format"), // FIXME: うえで`model`つかっちゃってるからなあw
        };
    }
    onChange(ev, i, value) {
        let model = this.state.model;
        model.value = value;
        model.save();
        this.setState({model});
    }
    onChangeDashboardTimer(ev, i, value) {
        let dashboard = this.state.dashboard;
        dashboard.value = value;
        dashboard.save();
        this.setState({dashboard});
    }
    onTimeFormatChange(ev, i, value) {
        let timefmt = this.state.timefmt;
        timefmt.value = value;
        timefmt.save();
        this.setState({timefmt});
    }
    render() {
        return (
          <div>
            <h1 style={this.props.styles.title}><Settings /> タイマー設定</h1>
            <div style={{display:"flex"}}>
              <div style={{flex: "1"}}>
                <Table selectable={false}>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn>右上のタイマー表示形式</TableRowColumn>
                      <TableRowColumn>
                          <SelectField value={this.state.model.value} onChange={this.onChange.bind(this)}>
                            <MenuItem value="separated-ids"      primaryText="種類別艦隊/ドック順形式" />
                            <MenuItem value="separated-timeline" primaryText="種類別艦時間順形式" />
                            <MenuItem value="merged-timeline"    primaryText="タイムライン形式" />
                          </SelectField>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>クロックモードのタイマー表示形式</TableRowColumn>
                      <TableRowColumn>
                          <SelectField value={this.state.dashboard.value} onChange={this.onChangeDashboardTimer.bind(this)}>
                            <MenuItem value="separated-ids"      primaryText="種類別艦隊/ドック順形式" />
                            <MenuItem value="separated-timeline" primaryText="種類別艦時間順形式" />
                            <MenuItem value="merged-timeline"    primaryText="タイムライン形式" />
                          </SelectField>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>時間表示</TableRowColumn>
                      <TableRowColumn>
                          <SelectField value={this.state.timefmt.value} onChange={this.onTimeFormatChange.bind(this)}>
                            <MenuItem value="clock" primaryText="時刻表示" />
                            <MenuItem value="rest"  primaryText="のこり時間表示" />
                          </SelectField>
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div style={{width: "240px", border:"thin solid #e0e0e0",padding: "12px"}}>
                <TimerExample mode={this.state.model.value} format={this.state.timefmt.value}/>
              </div>
            </div>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired,
    }
}
