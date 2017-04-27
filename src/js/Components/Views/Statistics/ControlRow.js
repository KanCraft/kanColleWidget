import React, {Component} from "react";
import PropTypes from "prop-types";
import {TableRow, TableHeaderColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton   from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import c from "../../../Constants/colors";
import {red300} from "material-ui/styles/colors";
import {Client} from "chomex";
import Config from "../../Models/Config";
import Resource from "../../Models/Resource";

class InputColumn extends Component {
  render() {
    const styles = {
      label: {},
      input: {},
    };
    const {color, label} = this.props;
    return (
      <div style={{flex: 1, display:"flex", padding:"0 8px"}}>
        <div style={{flex:1}}><span style={{...styles.label, color}}>{label}</span></div>
        <div style={{flex:1}}><input ref="input" type="number"  style={styles.input}/></div>
      </div>
    );
  }
  value() {
    return parseInt(this.refs.input.value) || null;
  }
  static propTypes = {
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
  }
}

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
    const props = Object.keys(this.refs)
    .map(key => ({key,ref:this.refs[key]}))
    .map(e => ({[e.key]:e.ref.value()}))
    .reduce((e, self) => ({...self, ...e}), {});
    try {
      Resource.create({...props, created:Date.now()});
      this.setState({inputDialogOpen:false,dialogError:""}, () => this.props.refresh());
    } catch (err) {
      window.alert(err.toString());
    }
  }
  render() {
    const styles = {
      dialogImageContainer: {
        position: "relative",
        overflow: "hidden",
        width: "200px",
        height: "100px",
      },
      dialogImage: {
        width: "600%",
        position: "absolute",
        right: 0, top: 0,
      },
      dialogError: {
        color: red300,
        fontSize: "0.8em",
      },
      dialogInputRowGroup: {
        display:"flex",
        marginBottom: "8px",
      },
      dialogInputCol: {
        flex: 1,
      }
    };
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
        <Dialog
          actions={[
            <FlatButton label="キャンセル" style={{marginRight:"8px"}} onClick={() => this.setState({inputDialogOpen:false,dialogError:""})} />,
            <RaisedButton primary={true} label="記録" onClick={this.onInputCommit.bind(this)} />
          ]}
          open={this.state.inputDialogOpen}
          onRequestClose={() => this.setState({inputDialogOpen:false,dialogError:""})}
        >
          <div style={{display:"flex"}}>
            <div style={styles.dialogImageContainer}>
              {this.state.dialogError ? <span style={styles.dialogError}>{this.state.dialogError}</span>
              :<img style={styles.dialogImage} src={this.state.dialogImage} />}
            </div>
            <div style={{flex:1, padding: "0 16px"}}>
              <div style={styles.dialogInputRowGroup}>
                {(new Date()).format("yyyy/MM/dd HH:mm")}
              </div>
              <div style={styles.dialogInputRowGroup}>
                <InputColumn ref="buckets"  label="修復材" color={c.buckets}/>
                <InputColumn ref="material" label="開発材" color={c.material}/>
              </div>
              <div style={styles.dialogInputRowGroup}>
                <InputColumn ref="fuel"  label="燃料" color={c.fuel}/>
                <InputColumn ref="steel" label="鋼材" color={c.steel}/>
              </div>
              <div style={styles.dialogInputRowGroup}>
                <InputColumn ref="ammo"    label="弾薬" color={c.ammo}/>
                <InputColumn ref="bauxite" label="ボーキサイト" color={c.bauxite}/>
              </div>
            </div>
          </div>
        </Dialog>
      </TableRow>
    );
  }
  static propTypes = {
    refresh: PropTypes.func.isRequired,
  }
}
