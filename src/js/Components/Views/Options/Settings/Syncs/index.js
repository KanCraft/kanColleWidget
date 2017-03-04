import React, {Component,PropTypes} from "react";
import {Client} from "chomex";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Toggle             from "material-ui/Toggle";
import Settings           from "material-ui/svg-icons/action/settings";
import RaisedButton       from "material-ui/RaisedButton";
import CloudUpload        from "material-ui/svg-icons/file/cloud-upload";
import CloudDownload      from "material-ui/svg-icons/file/cloud-download";

import Config from "../../../../Models/Config";
import Description from "../Description";

export default class SyncSettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: Config.find("data-sync"),
      output: "",
    };
    this.client = new Client(chrome.runtime);
  }
  render() {
    const output = {
      backgroundColor: "#303030",
      color:           "wheat",
      borderRadius:    "4px",
      padding:         "8px",
      maxHeight:       "100px",
      overflow:        "scroll",
    };
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> 複数PC間同期設定</h1>
        <Description>ブラウザのGoogleアカウントに紐付いたストレージ領域に各種データを保存したり同期したりします。くわしい仕組みは<a href="https://developer.chrome.com/extensions/storage">ここ</a>を見てください。</Description>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>登録済みタイマー</TableRowColumn>
              <TableRowColumn>
                <Toggle toggled={this.state.config.keys.has("ScheduledQueues")}
                      onToggle={() => this.onToggle("ScheduledQueues")}/>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>設定（画像・音声ファイルは無理）</TableRowColumn>
              <TableRowColumn>
                <Toggle toggled={this.state.config.keys.has("Config")}
                      onToggle={() => this.onToggle("Config")}/>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>
                <RaisedButton label="save" icon={<CloudUpload />} style={{marginRight: "12px"}} onClick={this.save.bind(this)}/>
                <RaisedButton label="load" labelPosition="before" icon={<CloudDownload />}      onClick={this.load.bind(this)}/>
              </TableRowColumn>
              <TableRowColumn>
                <pre style={output}>{this.state.output}</pre>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>
              </TableRowColumn>
              <TableRowColumn></TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
  save() {
    this.client.message("/sync/save", {keys: this.state.config.keys}).then(({data}) => {
      this.setState({output: "Data saved:\n------------\n" + JSON.stringify(data, null, 2)});
    });
  }
  load() {
    this.client.message("/sync/load", {keys: this.state.config.keys}).then(({data}) => {
      this.setState({output: "Data loaded:\n------------\n" + JSON.stringify(data, null, 2)});
    });
  }
  onToggle(key) {
    let config = this.state.config;
    if (config.keys.has(key)) config.keys = config.keys.filter(k => k != key);
    else config.keys = config.keys.concat([key]);
    config.save();
    this.setState({config});
  }
  static propTypes = {
    styles: PropTypes.object.isRequired
  }
}
