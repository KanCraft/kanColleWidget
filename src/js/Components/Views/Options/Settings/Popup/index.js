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
export default class PopupSettingsView extends Component {
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
            <h1 style={this.props.styles.title}><Settings /> ポップアップ表示設定</h1>
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn>タイマー表示</TableRowColumn>
                  <TableRowColumn>
                      <SelectField value={this.state.model.value} onChange={this.onChange.bind(this)}>
                        <MenuItem value="horizontal" primaryText="水平分割ドック/艦隊順" />
                        <MenuItem value="vertical-timeline" primaryText="垂直混合時間順" />
                      </SelectField>
                  </TableRowColumn>
                  <TableRowColumn>
                      <TimerExample mode={this.state.model.value}/>
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired,
    }
}
