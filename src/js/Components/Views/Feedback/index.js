import React, {Component} from "react";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Chip from "material-ui/Chip";
import {orange700, red500} from "material-ui/styles/colors";

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

class FeedbackContents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body:  "",
            view:  "",
            asIs:  "",
            toBe:  "",
            issue: "",
            env:   window.navigator.userAgent,
            version: chrome.runtime.getManifest().version,
        };
        this.styles = {
            row:{marginBottom: "8px", width:"100%"}
        };
        this.onTextFieldChange = this.onTextFieldChange.bind(this);
    }
    onTextFieldChange(ev) {
        this.setState({[ev.target.name]:ev.target.value});
    }
    render() {
        return (
            <div>
              <div style={this.styles.row}>
                <TextField name="title" fullWidth={true}
                  value={this.state.title}
                  onChange={this.onTextFieldChange}
                  errorText={this.state.title.length > 30 ? "30字以内でかいつまんでください" : null}
                  hintText="30字以内"
                  floatingLabelText="概要"/>
              </div>
              {this.getSpecificForms()}
              <div style={this.styles.row}>
                <TextField name="env" fullWidth={true}
                  value={this.state.env}
                  onChange={this.onTextFieldChange}
                  hintText="window.navigator.userAgent"
                  floatingLabelText="環境"/>
              </div>
              <div style={this.styles.row}>
                <TextField name="version" fullWidth={true}
                  value={this.state.version}
                  onChange={this.onTextFieldChange}
                  hintText="chrome.runtime.getManifest().version"
                  floatingLabelText="バージョン"/>
              </div>
            </div>
        );
    }
}

class BugReportView extends FeedbackContents {
    getSpecificForms() {
        return [
            <div style={this.styles.row} key={0}>
              <TextField name="view" fullWidth={true}
                value={this.state.view}
                onChange={this.onTextFieldChange}
                hintText="バグが発生している画面はどこですか？"
                floatingLabelText="問題のある画面"/>
            </div>,
            <div style={this.styles.row} key={1}>
              <TextField name="asIs" fullWidth={true}
                value={this.state.asIs}
                multiLine={true}
                onChange={this.onTextFieldChange}
                hintText="現状どのような挙動になっていますか？"
                floatingLabelText="観測される問題"/>
            </div>,
            <div style={this.styles.row} key={2}>
              <TextField name="toBe" fullWidth={true}
                value={this.state.toBe}
                multiLine={true}
                onChange={this.onTextFieldChange}
                hintText="本来どのような挙動が期待されますか？"
                floatingLabelText="期待される挙動"/>
            </div>,
            <div style={this.styles.row} key={3}>
              <TextField name="body" fullWidth={true}
                multiLine={true}
                value={this.state.body}
                onChange={this.onTextFieldChange}
                hintText="なるべく詳細が欲しいです"
                rows={2}
                floatingLabelText="再現方法" />
            </div>
        ];
    }
    getSearchParams() {
        let params = new URLSearchParams();
        params.set("title", this.state.title);
        let body = [
            "# 画面", this.state.view,
            "# 観測される問題", this.state.asIs,
            "# 期待される挙動", this.state.toBe,
            "# 再現方法", this.state.body,
            "-------",
            "環境", `> ${this.state.env}`,
            "バージョン", `> ${this.state.version}`
        ].join("\n\n");
        params.set("body", body);
        return params;
    }
}

class RequestView extends FeedbackContents {
    getSpecificForms() {
        return [
            <div style={this.styles.row} key={0}>
              <TextField name="body" fullWidth={true}
                multiLine={true}
                value={this.state.body}
                onChange={this.onTextFieldChange}
                hintText="Markdown形式も可"
                rows={2}
                floatingLabelText="詳細" />
            </div>,
            <div style={this.styles.row} key={1}>
              <TextField name="issue" fullWidth={true}
                multiLine={true}
                value={this.state.issue}
                onChange={this.onTextFieldChange}
                hintText="この機能を実装した場合に解決される問題はなんですか？"
                rows={2}
                floatingLabelText="解決される問題" />
            </div>
        ];
    }
    getSearchParams() {
        let params = new URLSearchParams();
        params.set("title", this.state.title);
        let body = [
            this.state.body,
            "# 解決される問題", this.state.issue,
            "-------",
            "環境", `> ${this.state.env}`,
            "バージョン", `> ${this.state.version}`
        ].join("\n\n");
        params.set("body", body);
        return params;
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
              <FlatButton primary={true} label="現在あがっているissue" onClick={() => location.href = "https://github.com/otiai10/kanColleWidget/issues?q=is%3Aissue+is%3Aopen+label%3A2.0"} />
              <BonoChan />
            </div>
            <div style={{flex:"1"}}>
              {
                this.state.hash == "#bug" ?
                <BugReportView ref="contents"/>
                : <RequestView ref="contents"/>
              }
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
