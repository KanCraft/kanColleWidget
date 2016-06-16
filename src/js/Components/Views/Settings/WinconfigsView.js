import React, {Component} from 'react';
import {Card, CardHeader, CardText,CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import Icon from '../FontAwesome';

class WinconfigDefaultWhiteView extends Component {
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
          <FlatButton disabled={true} label="delete" />
        </CardActions>
      </Card>
    )
  }
}

class WinconfigFormView extends Component {
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
          <FlatButton label="CANCEL" />
        </CardActions>
      </Card>

    )
  }
}

export default class WinconfigsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddForm: false
    }
  }
  render() {
    return (
      <div>
        <WinconfigDefaultWhiteView />
        {(this.state.showAddForm) ?  <WinconfigFormView /> : null }
        {(this.state.showAddForm) ? null : <RaisedButton
          linkButton={true}
          onClick={() => {
            this.setState({showAddForm: true})
          }}
          icon={<Icon name="plus" />}
          label="ADD"
          /> }
      </div>
    )
  }
}
