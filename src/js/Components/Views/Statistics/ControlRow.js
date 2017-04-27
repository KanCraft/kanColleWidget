import React, {Component} from "react";
import PropTypes from "prop-types";
import {TableRow, TableHeaderColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import c from "../../../Constants/colors";
import {Client} from "chomex";
import Config from "../../Models/Config";
import Resource from "../../Models/Resource";

import ResourceInputDialog from "../Common/ResourceInputDialog";

export default class ControlRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowloading: false,
      inputDialogOpen: false,
      dialogImage: "",
      dialogError: "",
    };
  }
  onClick() {
    this.setState({nowloading:true});
    const client = new Client(chrome.runtime);
    client.message("/resources/capture").then(() => {
      this.setState({nowloading:false}, () => this.props.refresh());
    }).catch(err => {
      this.setState({nowloading:false});
      window.alert(JSON.stringify(err));
    });
  }
  onClickAttemptInput() {
    // 1. まずゲーム画面の断片をもらう
    const client = new Client(chrome.runtime);
    client.message("/window/capture").then(res => {
      return Promise.resolve(res);
    }).catch(err => {
      return Promise.resolve(err);
    }).then(({data, message}) => {
      this.setState({inputDialogOpen:true, dialogImage:data, dialogError:message});
    });
    // 2. 数値入力用のダイアログを表示する
    // 3. バリデーションしつつ、保存する
    // 4. ダイアログを非表示にする
    // 5. this.props.refresh()
  }
  renderActionButton() {
    if (Config.find("resource-statistics").value == "input") {
      return <RaisedButton disabled={this.state.nowloading} onClick={this.onClickAttemptInput.bind(this)} style={{width:"100%"}} label="入力" />;
    }
    return <RaisedButton disabled={this.state.nowloading} onClick={this.onClick.bind(this)} style={{width:"100%"}} label="取得" />;
  }
  onInputCommit() {
    const props = this.refs.input.values();
    try {
      Resource.create({...props, created:Date.now()});
      this.setState({inputDialogOpen:false,dialogError:""}, () => this.props.refresh());
    } catch (err) {
      window.alert(err.toString());
    }
  }
  render() {
    return (
      <TableRow>
        <TableHeaderColumn>日付</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.fuel}}>燃料</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.ammo}}>弾薬</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.steel}}>鋼材</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.bauxite}}>ボーキサイト</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.buckets}}>修復材</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.material}}>開発材</TableHeaderColumn>
        <TableHeaderColumn>{this.renderActionButton()}</TableHeaderColumn>
        <ResourceInputDialog
          ref={"input"}
          onInputCommit={this.onInputCommit.bind(this)}
          open={this.state.inputDialogOpen}
          image={this.state.dialogImage}
          error={this.state.dialogError}
          close={() => this.setState({inputDialogOpen:false,dialogError:""})}
        />
      </TableRow>
    );
  }
  static propTypes = {
    refresh: PropTypes.func.isRequired,
  }
}
