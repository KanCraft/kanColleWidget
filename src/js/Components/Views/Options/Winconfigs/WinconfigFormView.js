import React, {Component, PropTypes} from "react";
import {Card, CardText, CardActions} from "material-ui/Card";
import TextField from "material-ui/TextField";
import Checkbox  from "material-ui/Checkbox";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import FlatButton from "material-ui/FlatButton";

import {Client} from "chomex";
import Frame from "../../../Models/Frame";

export default class WinconfigFormView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frame: Frame.template()
    };
  }
  render() {
    return (
      <Card style={{marginBottom: "20px"}}>
        <CardText>
          <div>
                name <TextField name="alias" value={this.state.frame.alias || ""} onChange={this.onNameChanged.bind(this)}/>
          </div>
          <div>
                width <TextField name="width" value={this.state.frame.size.width} onChange={this.onSizeChanged.bind(this)}/>
              height <TextField name="height" value={this.state.frame.size.height} onChange={this.onSizeChanged.bind(this)}/>
          </div>
          {this.renderPositionFields()}
          {this.getAddressbarCheckbox()}
          <RadioButtonGroup name="decoration" defaultSelected="FRAME_SHIFT" valueSelected={this.state.frame.decoration} onChange={this.onDecorationChanged.bind(this)}>
            <RadioButton value="FRAME_SHIFT" label="[WHITE] ゲームコンテンツの左上がウィンドウの左上になるようにずらす"/>
            <RadioButton value="EXTRACT" label="[APP] ゲームコンテンツを切り出してウィンドウぴったりの大きさにする"/>
          </RadioButtonGroup>
        </CardText>
        <CardActions>
          <FlatButton label="OK"     onClick={this.commit.bind(this)} disabled={!this.state.frame.valid()} />
          <FlatButton label="CANCEL" onClick={this.props.toggleAddForm} />
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
              left <TextField value={this.state.frame.position.left} name="left" onChange={this.onPositionChanged.bind(this)} />
               top <TextField value={this.state.frame.position.top} name="top" onChange={this.onPositionChanged.bind(this)} />
              zoom <TextField value={this.state.frame.zoom} name="zoom" onChange={this.onZoomChanged.bind(this)} />
      </div>
    );
  }
  onNameChanged(ev) {
    let frame   = this.state.frame;
    frame.id    = ev.target.value;
    frame.alias = ev.target.value;
    this.setState({frame: this.state.frame});
  }
  onSizeChanged(ev) {
    let frame   = this.state.frame;
    frame.size[ev.target.name] = ev.target.value;
    this.setState({frame});
  }
  onPositionChanged(ev) {
    let frame   = this.state.frame;
    frame.position[ev.target.name] = ev.target.value;
    this.setState({frame});
  }
  onZoomChanged(ev) {
    let frame = this.state.frame;
    frame.zoom = ev.target.value;
    this.setState({frame});
  }
  onDecorationChanged(ev) {
    let frame = this.state.frame;
    frame.decoration = ev.target.value;
    this.setState({frame});
  }
  commit() {
    const client = new Client(chrome.runtime, true);
    client.message("/frame/new", this.state.frame.regulate()).then(() => {
      location.reload(); // TODO: なんかreduxとかそういうの使って親のstate変える
    });
  }
  static propTypes = {
    toggleAddForm: PropTypes.func
  }
}
