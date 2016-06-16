import React, {Component} from 'react';
import {Card, CardHeader, CardText,CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import Icon from '../../FontAwesome';

// App
import Config from '../../../Models/Config';

// Partials
import WinconfigView from './WinconfigView';
import WinconfigDefaultWhiteView from './WinconfigDefaultWhiteView';
import WinconfigFormView from './WinconfigFormView';

export default class WinconfigsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wins: Config.find('winconfigs').value,
      showAddForm: false
    }
  }
  toggleAddForm() {
    this.setState({showAddForm: !this.state.showAddForm});
  }
  render() {
    const wins = this.state.wins.map((win, i) => {
      return <WinconfigView key={i} win={win} />;
    });
    return (
      <div>
        <WinconfigDefaultWhiteView />

        {wins}

        {(this.state.showAddForm) ?  <WinconfigFormView
          toggleAddForm={this.toggleAddForm.bind(this)}
          /> : null }

        {(this.state.showAddForm) ? null : <RaisedButton
          linkButton={true}
          onClick={this.toggleAddForm.bind(this)}
          icon={<Icon name="plus" />}
          label="ADD"
          /> }
      </div>
    )
  }
}
