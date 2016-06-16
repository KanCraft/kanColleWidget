import React, {Component} from 'react';
import {Card, CardHeader, CardText,CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';

export default class WinconfigDefaultWhiteView extends Component {
  render() {
    return (
      <Card style={{marginBottom: '20px'}}>
        <CardHeader
          title="DEFAULT WHITE"
          subtitle="デフォルトで設定されてるWHITEモードの窓です."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>
            name <TextField name="alias" value="DEFAULT WHITE" disabled={true}/>
          </div>
          <div>
            width <TextField name="alias" value="800" disabled={true}/>
            height <TextField name="alias" value="480" disabled={true}/>
          </div>
          <RadioButtonGroup name="decoration" defaultSelected="FRAME_SHIFT">
            <RadioButton value="FRAME_SHIFT" label="FRAME SHIFT" disabled={true}/>
            <RadioButton value="EXTRACT" label="EXTRACT" disabled={true}/>
          </RadioButtonGroup>
        </CardText>
        <CardActions expandable={true}>
          <FlatButton disabled={true} label="delete (削除不可)" />
        </CardActions>
      </Card>
    )
  }
}
