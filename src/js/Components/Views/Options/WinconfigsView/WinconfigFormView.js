import React, {Component} from 'react';
import {Card, CardText, CardActions} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';

export default class WinconfigFormView extends Component {
  render() {
    return (
      <Card style={{marginBottom: '20px'}}>
        <CardText>
          <div>
            name <TextField name="alias"/>
          </div>
          <div>
            width <TextField name="alias"/>
            height <TextField name="alias"/>
          </div>
          <RadioButtonGroup name="decoration" defaultSelected="FRAME_SHIFT">
            <RadioButton value="FRAME_SHIFT" label="FRAME SHIFT"/>
            <RadioButton value="EXTRACT" label="EXTRACT"/>
          </RadioButtonGroup>
        </CardText>
        <CardActions>
          <FlatButton label="OK" />
          <FlatButton label="CANCEL" onClick={this.props.toggleAddForm} />
        </CardActions>
      </Card>
    )
  }
}
