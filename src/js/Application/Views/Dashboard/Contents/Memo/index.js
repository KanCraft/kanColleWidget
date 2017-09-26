import React, {Component,PropTypes} from "react";
import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import Memo from "../../../../Models/Memo";
import Counter from "../../../../Models/Counter";
import CounterView from "./CounterView";

class MemoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: Memo.find("text"),
    };
    this.lines = this.state.text.value.split("\n").length;
    this.fontSize = 12;
  }
  onChangeMemoText(ev) {
    let text = this.state.text;
    text.value = ev.target.value;
    text.save();
    this.setState({text});
  }
  render() {
    const height = (this.lines + 1) * (this.fontSize + 4) + "px";
    return (
      <textarea
            style={{width:"98%", fontSize: this.fontSize + "px", height}}
            onChange={this.onChangeMemoText.bind(this)}
            value={this.state.text.value}
            >
      </textarea>
    );
  }
}

export default class DashboardMemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      label: "",
      error: "",
      list:  Counter.list(),
    };
  }
  showNewCounterDialog() {
    this.setState({open:true});
  }
  onCreateCommit() {
    if (this.state.label.length == 0) {
      return this.setState({error:"ラベルを入力してください"});
    }
    Counter.create({label:this.state.label, count:0});
    this.setState({list:Counter.list(), open:false});
  }
  render() {
    const styles = {
      plus: {
        display:"flex", justifyContent:"center",alignItems:"center",cursor:"pointer",fontSize:"1.2em",marginTop:"12px",
      }
    };
    return (
      <div style={{...this.props.style}}>
        <div style={{marginRight:"28px", display:"flex"}}>
          <div style={{flex:2}}>
            <MemoView />
            <RaisedButton label="WIKIの早見表" onClick={() => window.open("/dest/html/wiki.html")} />
          </div>
          <div style={{flex:1}}>
            {this.state.list.map((c, i) => <CounterView key={i} counter={c} refresh={() => this.setState({list:Counter.list()})} />)}
            <div style={styles.plus} onClick={this.showNewCounterDialog.bind(this)}>+</div>
          </div>
        </div>
        <Dialog open={this.state.open} onRequestClose={() => this.setState({open:false})}>
          <TextField fullWidth={true} hintText={"ラベル"} errorText={this.state.error} onChange={(ev, val) => this.setState({label:val})}/>
          <RaisedButton style={{float:"right"}} label="カスタムカウンター作成" onClick={this.onCreateCommit.bind(this)}/>
        </Dialog>
      </div>
    );
  }
  static propTypes = {
    style: PropTypes.object.isRequired,
  }
}
