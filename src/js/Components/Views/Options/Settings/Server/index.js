import React, {Component} from "react";
import PropTypes from "prop-types";

import Settings from "material-ui/svg-icons/action/settings";
import TextField from "material-ui/TextField";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";

import Description from "../Description";

import Config from "../../../../Models/Config";

export default class ServerSettingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: Config.find("api-server-url"),
      output: "",
    };
  }
  render() {
    const description = [
      "『艦これウィジェット』は、画像認識による入渠時間・建造時間・資源推移の取得をしています。",
      "この画像認識をするために、開発者が汎用OCRサーバを構築し、それを利用しています。",
      "また、「動画キャプチャ」機能で撮影されたwebmファイルをmp4/gifへ変換する処理も同サーバ上で行っています。",
      "とくにイベント中などはこのサーバが混雑し、各種時間の取得の失敗などが観測されているため、",
      "デフォルトで利用できるサーバ以外にも向き先を設定することで、任意の負荷分散をできるようにしました。",
      "誰かが立てたサーバインスタンスに向けることや、自分でインスタンスを立てることも可能です。サーバのソースコードとインスタンスの立て方は次のリンクを参照してください。"
    ].join("");
    const output = {
      backgroundColor: "#303030",
      color:           "wheat",
      borderRadius:    "4px",
      padding:         "8px",
      maxHeight:       "180px",
      overflow:        "scroll",
    };
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> OCR/Converter サーバ設定</h1>
        <Description>{description}<a target="_blank" href="https://github.com/otiai10/api-kcwidget">https://github.com/otiai10/api-kcwidget</a></Description>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>サーバURL</TableRowColumn>
              <TableRowColumn>
                <TextField
                  hintText="#艦これ"
                  fullWidth={true}
                  onChange={ev => this.setState({url: this.state.url.update({value: ev.target.value})})}
                  value={this.state.url.value}
                />
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>
                <RaisedButton label="TEST" style={{marginRight: "12px"}} onClick={() => {
                  const url = this.state.url.value.replace(/\/+$/,"") + "/status";
                  this.setState({output: "Loading..."});
                  fetch(url).then(res => res.json()).then(res => {
                    this.setState({output: ["GET",url,"OK","-------", JSON.stringify(res, null, "    ")].join("\n")});
                  }).catch(err => {
                    this.setState({output: ["GET",url,"NG","-------",err].join("\n")});
                  });
                }}/>
              </TableRowColumn>
              <TableRowColumn>
                <pre style={output}>{this.state.output}</pre>
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
