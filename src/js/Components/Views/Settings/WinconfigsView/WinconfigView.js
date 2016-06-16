import React, {Component, PropTypes} from 'react';

import {Card, CardHeader, CardText,CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';

export default class WinconfigView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      win: this.props.win
    }
  }
  render() {
    return (
      <Card style={{marginBottom: '20px'}}>
        <CardHeader
          title={this.props.win.alias}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>
            name <TextField name="alias" value={this.state.win.alias}/>
          </div>
          <div>
            width <TextField name="alias" value={this.state.win.size.width}/>
            height <TextField name="alias" value={this.state.win.size.height}/>
          </div>
          <RadioButtonGroup name="decoration" defaultSelected={this.state.win.decoration}>
            <RadioButton value="FRAME_SHIFT" label="ゲームコンテンツの左上がウィンドウの左上になるまでずらす"/>
            <RadioButton value="EXTRACT" label="ゲームコンテンツを切り出してウィンドウぴったりの大きさにする"/>
          </RadioButtonGroup>
        </CardText>
        <CardActions expandable={true}>
          <FlatButton label="OK" />
          <FlatButton label="DELETE"/>
        </CardActions>
      </Card>
    )
  }
}

WinconfigView.propTypes = {
  win: PropTypes.object
}
