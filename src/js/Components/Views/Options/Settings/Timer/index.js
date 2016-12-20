import React, {Component,PropTypes} from "react";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Settings           from "material-ui/svg-icons/action/settings";
import SelectField        from "material-ui/SelectField";
import MenuItem           from "material-ui/MenuItem";

import {HorizontalQueuesView, VerticalTimelineView} from "../../../Popup/QueuesView";
import {ScheduledQueues}        from "../../../../Models/Queue/Queue";
import Config                   from "../../../../Models/Config";

class TimerExample extends Component {
    constructor(props) {
        super(props);
        this.queues = ScheduledQueues.all();
    }
    getHorizontalList() {
        return <HorizontalQueuesView queues={this.queues} />;
    }
    getTimelineList() {
        return <VerticalTimelineView queues={this.queues} />;
    }
    getList() {
        switch (this.props.mode) {
        case "vertical-timeline": return this.getTimelineList();
        case "horizontal":
        default:
            return this.getHorizontalList();
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
        mode: PropTypes.string.isRequired,
    }
}

export default class TimerSettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: Config.find("schedule-display-mode")
        };
    }
    onChange(ev, i, value) {
        let model = this.state.model;
        model.value = value;
        model.save();
        this.setState({model});
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
                      <TableRowColumn>タイマー表示形式</TableRowColumn>
                      <TableRowColumn>
                          <SelectField value={this.state.model.value} onChange={this.onChange.bind(this)}>
                            <MenuItem value="horizontal"        primaryText="種類別艦隊順形式" />
                            <MenuItem value="vertical-timeline" primaryText="タイムライン形式" />
                          </SelectField>
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div style={{width: "240px", border:"thin solid #e0e0e0",padding: "12px"}}>
                <TimerExample mode={this.state.model.value}/>
              </div>
            </div>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired,
    }
}
