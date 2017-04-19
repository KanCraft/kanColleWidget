import React, {Component} from "react";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import Chip from "material-ui/Chip";
import {orange700, red500} from "material-ui/styles/colors";

import BugReportView from "./BugReportView";
import RequestView   from "./RequestView";

class BonoChan extends Component {
  render() {
    return (
      <div
            style={{position: "relative", transition: "all 0.2s"}}
            >
        <img src="/dest/img/bono.png" width="180px" />
        <span style={{position:"absolute", right: "0",bottom:"0", fontSize:"0.8em"}}>Illustrated by <a href="http://roonyan.com">@roonyan</a></span>
      </div>
    );
  }
}

export default class FeedbackView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: location.hash,
    };
  }
  hash(hash) {
    location.hash = hash;
    this.setState({hash});
  }
  onCommit() {
    let errors = this.refs.contents.validate();
    if (Object.keys(errors).length != 0) return alert(errors.map(err => err.description).join("\n"));
    let params = this.refs.contents.getSearchParams();
    params.append("labels[]", "2.0");// TODO: ラベルの作り方が悪かったけど、動的にしたい
    params.append("labels[]", this.state.hash.replace("#",""));
    location.href = `https://github.com/otiai10/kanColleWidget/issues/new?${params.toString()}`;
  }
  render() {
    const balloon = {
      border: "thin solid #aaa",
      borderRadius: "4px",
      position:"relative",
    };
    const rows = {marginBottom: "8px", width:"100%"};
    const chip = {marginRight: "8px"};
    return (
      <div style={{display:"flex", width: "100%", marginBottom: "48px"}}>
        <div style={{marginRight: "18px"}}>
          <div style={balloon}>
            <FlatButton
                  secondary={this.state.hash == "#bug"}
                  label="バグ報告" style={{width: "100%"}}
                  onClick={() => this.hash("#bug")}/>
            <FlatButton
                  secondary={this.state.hash == "#request"}
                  label="機能要望" style={{width: "100%"}}
                  onClick={() => this.hash("#request")}/>
          </div>
          <FlatButton primary={true} label="現在あがっているissue" onClick={() => location.href = "https://github.com/otiai10/kanColleWidget/issues?q=is%3Aissue"} />
          <BonoChan />
          <FlatButton primary={true} style={{width:"100%",color:"#ddd"}} label="ほしいものリスト" onClick={() => window.open("https://www.amazon.co.jp/registry/wishlist/1K4E93FSE3UQ4/?tag=otiai10-22")} />
        </div>
        <div style={{flex:"1"}}>
          {this.state.hash == "#bug" ? <BugReportView ref="contents"/> : <RequestView ref="contents"/>}
          <div style={{...rows, ...{display:"flex"}}}>
            <Chip style={{...chip, ...{backgroundColor: orange700}}}>2.0</Chip>
            <Chip style={{...chip, ...{backgroundColor: red500}}}>{this.state.hash.replace("#", "")}</Chip>
          </div>
          <RaisedButton
                style={{marginRight: "12px"}}
                primary={true}
                label="作成"
                onClick={this.onCommit.bind(this)}
              />
          <small>GitHubでissueを作成します。GitHubのアカウントが必要です。</small>
        </div>
      </div>
    );
  }
}
