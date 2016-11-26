import React, {Component, PropTypes} from "react";

import {Card, CardHeader, CardText,CardActions} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import TextField from "material-ui/TextField";

import {Client} from "chomex";

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
                    name <TextField name="alias" value={this.state.frame.alias}/>
                  </div>
                  <div>
                    width <TextField name="width" value={this.state.frame.size.width} onChange={this.onSizeChanged.bind(this)}/>
                   height <TextField name="height" value={this.state.frame.size.height} onChange={this.onSizeChanged.bind(this)}/>
                  </div>
                  {this.renderPositionFields()}
                  <RadioButtonGroup name="decoration" defaultSelected={this.state.frame.decoration}>
                    <RadioButton disabled={this.state.frame.protected} value="FRAME_SHIFT" label="ゲームコンテンツの左上がウィンドウの左上になるようにずらす"/>
                    <RadioButton disabled={this.state.frame.protected} value="EXTRACT" label="ゲームコンテンツを切り出してウィンドウぴったりの大きさにする"/>
                  </RadioButtonGroup>
                </CardText>
                <CardActions expandable={true}>
                  <FlatButton label="UPDATE" onClick={this.updateFrame.bind(this)} />
                  <FlatButton label="DELETE" disabled={this.state.frame.protected} onClick={this.deleteFrame.bind(this)}/>
                </CardActions>
            </Card>
        );
    }
    renderPositionFields() {
        if (this.state.frame.decoration == "EXTRACT") return null;
        return (
            <div>
              left <TextField value={this.state.frame.position.left} name="left" onChange={this.onPositionChanged.bind(this)} />
               top <TextField value={this.state.frame.position.top} name="top" onChange={this.onPositionChanged.bind(this)} />
              zoom <TextField value={this.state.frame.zoom} name="zoom" onChange={this.onZoomChanged.bind(this)}/>
            </div>
        );
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
        const client = new Client(chrome.runtime);
        client.message("/frame/update", {frame: this.state.frame.regulate()}).then(() => location.reload());
    }
}

WinconfigView.propTypes = {
    frame: PropTypes.object
};
