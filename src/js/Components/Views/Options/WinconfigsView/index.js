import React, {Component} from "react";
// import {Card, CardHeader, CardText,CardActions} from "material-ui/Card";
// import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
// import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
// import TextField from "material-ui/TextField";
import Icon from "../../FontAwesome";

// App
import Frame from "../../../Models/Frame";

// Partials
import WinconfigView     from "./WinconfigView";
import WinconfigFormView from "./WinconfigFormView";

export default class WinconfigsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wins: Frame.all(),
            showAddForm: false
        };
    }
    toggleAddForm() {
        this.setState({showAddForm: !this.state.showAddForm});
    }
    render() {
        const wins = Object.keys(this.state.wins).map(id => {
            return <WinconfigView key={id} win={this.state.wins[id]} />;
        });
        return (
      <div>

        {wins}

        {(this.state.showAddForm) ?  <WinconfigFormView
          toggleAddForm={this.toggleAddForm.bind(this)}
          /> : null }

        {(this.state.showAddForm) ? null : <RaisedButton
          onClick={this.toggleAddForm.bind(this)}
          icon={<Icon name="plus" />}
          label="ADD"
          /> }
      </div>
    );
    }
}
