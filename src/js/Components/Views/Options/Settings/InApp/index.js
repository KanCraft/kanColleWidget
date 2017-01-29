import React, {Component,PropTypes} from "react";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import SelectField from "material-ui/SelectField";
import MenuItem    from "material-ui/MenuItem";
import Toggle      from "material-ui/Toggle";

import SettingSwitch from "../SettingSwitch";
import Config from "../../../../Models/Config";

import Settings from "material-ui/svg-icons/action/settings";

// 未分類クラス！！
class DamageSnapshotSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: Config.find("damagesnapshot-window")
        };
    }
    render() {
        return (
            <TableRow>
              <TableRowColumn>
                大破進撃防止窓
              </TableRowColumn>
              <TableRowColumn>
                <SelectField value={this.state.model.value} onChange={this.onChange.bind(this)}>
                  <MenuItem value="disabled" primaryText="使用しない"   />
                  <MenuItem value="inwindow" primaryText="ゲーム画面左上"/>
                  <MenuItem value="separate" primaryText="別窓表示"     />
                </SelectField>
              </TableRowColumn>
            </TableRow>
        );
    }
    onChange(ev, i, value) {
        let model = this.state.model;
        model.value = value;
        model.save();
        this.setState({model});
    }
}


export default class InAppSettingsView extends Component {
    render() {
        return (
          <div>
            <h1 style={this.props.styles.title}><Settings /> ゲーム画面設定</h1>
            <Table>
              <TableBody>
                <DamageSnapshotSetting />
                <SettingSwitch
                  title="ゲーム画面右上にミュートなどのボタンを表示する"
                  model="use-inapp-action-buttons" />
                <SettingSwitch
                  title="ゲーム画面を閉じるときアラートを出す"
                  model="alert-on-before-unload" />
              </TableBody>
            </Table>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired
    }
}
