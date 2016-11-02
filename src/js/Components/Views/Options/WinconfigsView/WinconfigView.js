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
                    width <TextField name="alias" value={this.state.frame.size.width}/>
                    height <TextField name="alias" value={this.state.frame.size.height}/>
                  </div>
                  <RadioButtonGroup name="decoration" defaultSelected={this.state.frame.decoration}>
                    <RadioButton value="FRAME_SHIFT" label="ゲームコンテンツの左上がウィンドウの左上になるようにずらす"/>
                    <RadioButton value="EXTRACT" label="ゲームコンテンツを切り出してウィンドウぴったりの大きさにする"/>
                  </RadioButtonGroup>
                </CardText>
                <CardActions expandable={true}>
                  <FlatButton label="OK" disabled={this.state.frame.protected} />
                  <FlatButton label="DELETE" disabled={this.state.frame.protected} onClick={this.deleteFrame.bind(this)}/>
                </CardActions>
            </Card>
        );
    }
    deleteFrame() {
        const client = new Client(chrome.runtime);
        client.message("/frame/delete", {_id: this.props.frame._id}).then(() => {
            location.reload(); // TODO: なんかreduxとかそういうの使って親のstate変える
        });
    }
}

WinconfigView.propTypes = {
    frame: PropTypes.object
};
