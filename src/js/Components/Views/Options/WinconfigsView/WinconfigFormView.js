import React, {Component, PropTypes} from "react";
import {Card, CardText, CardActions} from "material-ui/Card";
import TextField from "material-ui/TextField";
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
              <RadioButtonGroup name="decoration" defaultSelected="FRAME_SHIFT" valueSelected={this.state.frame.decoration}>
                <RadioButton value="FRAME_SHIFT" label="ゲームコンテンツの左上がウィンドウの左上になるようにずらす"/>
                <RadioButton value="EXTRACT" label="ゲームコンテンツを切り出してウィンドウぴったりの大きさにする"/>
              </RadioButtonGroup>
            </CardText>
            <CardActions>
              <FlatButton label="OK"     onClick={this.commit.bind(this)} disabled={!this.state.frame.valid()} />
              <FlatButton label="CANCEL" onClick={this.props.toggleAddForm} />
            </CardActions>
          </Card>
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
        frame.size[ev.target.name] = parseInt(ev.target.value);
        this.setState({frame: this.state.frame});
    }
    commit() {
        const client = new Client(chrome.runtime, true);
        client.message("/frame/new", this.state.frame).then(res => {
            console.log(res);
            location.reload(); // TODO: なんかreduxとかそういうの使って親のstate変える
        });
    }
    static propTypes = {
        toggleAddForm: PropTypes.func
    }
}
