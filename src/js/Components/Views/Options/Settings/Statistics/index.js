import React, {Component} from "react";
import PropTypes from "prop-types";

import Settings from "material-ui/svg-icons/action/settings";
import Timeline from "material-ui/svg-icons/action/timeline";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Toggle   from "material-ui/Toggle";

import Config from "../../../../Models/Config";
import Description from "../Description";

export default class StatisticsSettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: Config.find("resource-statistics"),
      round: Config.find("resource-statistics-round-digit"),
    };
  }
  onRoundToggle(ev, value) {
    this.state.round.update({value});
    this.setState({round: this.state.round});
  }
  render() {
    const description = [
      "この設定を「自動取得」にすると、以下の条件で右上の資源の表示を画像解析で自動に取得します。",
      " (1) 編成画面への遷移時で、(2) 画面が中型以上の大きさを持っており、(3) 縦横比が800x480ぴったり、 (4) なお取得成功した場合も同時刻のレコードは上書きして1つのレコードとして保存されます。",
      "この設定を「手動取得」にすると、ダッシュボードおよび資源推移ページの「取得」ボタンが押されたタイミングで取得を試みます。",
      " この場合、取得成功したレコードは同日中であっても別レコードとして保存されます。",
      "いずれにしても画像解析を使っていますので、画面が大きく画質が良いほうが精度は高いです。",
      "画面の解像度などの問題で画像解析での取得がもうまったく動かねえ！っていう場合は「手動入力」にすると、自分で数値を入力する感じでどうにかしてください。"
    ].join("");
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> 資源推移表 <a href="/dest/html/statistics.html" style={{paddingLeft:"12px"}}><Timeline style={{color:"#39f"}}/></a></h1>
        <Description>{description}</Description>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                資源推移表を使う
              </TableRowColumn>
              <TableRowColumn>
                <SelectField value={this.state.model.value || "disabled"} fullWidth={true} onChange={(ev, i, value) => {
                  let model = this.state.model; model.update({value}); this.setState({model});
                }}>
                  <MenuItem value={"disabled"}  primaryText={"使わない"} />
                  <MenuItem value={"input"}     primaryText={"手動入力（画像解析を使わない）"} />
                  <MenuItem value={"manual"}    primaryText={"手動取得（任意のタイミングで画像解析する）"} />
                  <MenuItem value={"automatic"} primaryText={"自動取得（高解像度ディスプレイ向き）"} />
                </SelectField>
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>
                資源記録ツイートの数値を丸める（1000 = 1k）
              </TableRowColumn>
              <TableRowColumn>
                <Toggle toggled={this.state.round.value} onToggle={this.onRoundToggle.bind(this)}/>
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
