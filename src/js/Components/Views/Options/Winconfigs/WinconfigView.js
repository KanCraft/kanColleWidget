import React, {Component, PropTypes} from "react";

import {Card, CardHeader, CardText,CardActions} from "material-ui/Card";
import {RadioButton, RadioButtonGroup}          from "material-ui/RadioButton";
import FlatButton  from "material-ui/FlatButton";
import Checkbox    from "material-ui/Checkbox";
import TextField   from "material-ui/TextField";
import {orange500} from "material-ui/styles/colors";

import {Client} from "chomex";

const styles = {
  warning: {
    display: "inline-block",
    fontSize: "0.6em",
    color:    orange500,
  }
};

export default class WinconfigView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frame: this.props.frame
    };
  }
  render() {
    return (
      <Card style={{marginBottom: "20px"}}>
        <CardHeader
                  title={this.state.frame.alias}
                  actAsExpander={true}
                  showExpandableButton={true}
                />
        <CardText expandable={true}>
          <div>
            <TextField
                      name="alias"
                      floatingLabelText={"name" + (this.state.frame.protected ? "（保護された設定）" : "")}
                      value={this.state.frame.alias}
                      disabled={this.state.frame.protected}
                      onChange={this.onAliasChanged.bind(this)}/>
          </div>
          <div>
            <TextField
                      name="width"
                      floatingLabelText="width"
                      value={this.state.frame.size.width}
                      onChange={this.onSizeChanged.bind(this)}/>
            <TextField
                      name="height"
                      floatingLabelText="height"
                      value={this.state.frame.size.height}
                      onChange={this.onSizeChanged.bind(this)}/>
          </div>
          {this.renderPositionFields()}
          {this.getAddressbarCheckbox()}
          <RadioButtonGroup name="decoration" defaultSelected={this.state.frame.decoration}>
            <RadioButton disabled={this.state.frame.protected} value="FRAME_SHIFT" label="[WHITE] ゲームコンテンツの左上がウィンドウの左上になるようにずらす"/>
            <RadioButton disabled={this.state.frame.protected} value="EXTRACT" label="[APP] ゲームコンテンツを切り出してウィンドウぴったりの大きさにする"/>
          </RadioButtonGroup>
        </CardText>
        <CardActions expandable={true}>
          <FlatButton label="UPDATE" onClick={this.updateFrame.bind(this)} />
          <FlatButton
                    label={(this.state.frame.protected) ? "PROTECTED" : "DELETE"}
                    disabled={this.state.frame.protected}
                    onClick={this.deleteFrame.bind(this)}/>
        </CardActions>
      </Card>
    );
  }
  getAddressbarCheckbox() {
    if (this.state.frame.decoration == "EXTRACT") return null;
    return <Checkbox label="アドレスバー表示" checked={this.state.frame.addressbar || false} onCheck={(ev, checked) => {
      let frame = this.state.frame;
      frame.addressbar = checked;
      this.setState({frame});
    }}/>;
  }
  renderPositionFields() {
    if (this.state.frame.decoration == "EXTRACT") return null;
    return (
      <div>
        <TextField
                name="left"
                floatingLabelText="left"
                value={this.state.frame.position.left}
                onChange={this.onPositionChanged.bind(this)}/>
        <TextField
                name="top"
                floatingLabelText="top"
                value={this.state.frame.position.top}
                onChange={this.onPositionChanged.bind(this)}/>
        <TextField
                name="zoom"
                floatingLabelText="zoom"
                value={this.state.frame.zoom}
                onChange={this.onZoomChanged.bind(this)}/>
        <span style={styles.warning}>zoomの指定はDMM.comドメイン全体に反映されます</span>
      </div>
    );
  }
  onAliasChanged(ev) {
    let frame = this.state.frame;
    frame.alias = ev.target.value;
    this.setState({frame});
  }
  onSizeChanged(ev) {
    let frame = this.state.frame;
    frame.size[ev.target.name] = ev.target.value;
    this.setState({frame});
  }
  onPositionChanged(ev) {
    let frame = this.state.frame;
    frame.position[ev.target.name] = ev.target.value;
    this.setState({frame});
  }
  onZoomChanged(ev) {
    if (parseFloat(ev.target.value) != ev.target.value
          && !ev.target.value.match(/[0-9]+\.$/)
          && ev.target.value !== ""
        ) return;
    let frame = this.state.frame;
    frame.zoom = ev.target.value;
    this.setState({frame});
  }
  deleteFrame() {
    const client = new Client(chrome.runtime);
    client.message("/frame/delete", {_id: this.props.frame._id}).then(() => location.reload());
  }
  updateFrame() {
    // TODO: バリデーションちゃんとしよう
    if (this.state.frame.alias.trim() == "") return window.alert("名前は必須です");
    const client = new Client(chrome.runtime);
    client.message("/frame/update", {frame: this.state.frame.regulate()}).then(() => location.reload());
  }
}

WinconfigView.propTypes = {
  frame: PropTypes.object
};
