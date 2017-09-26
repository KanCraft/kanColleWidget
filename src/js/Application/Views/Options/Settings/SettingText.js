import React, {Component} from "react";
import PropTypes from "prop-types";

import {TableRow, TableRowColumn} from "material-ui/Table";
import TextField from "material-ui/TextField";
import Config from "../../../Models/Config";

export default class SettingText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: Config.find(this.props.model)
    };
  }
  render() {
    return (
      <TableRow>
        <TableRowColumn>
          {this.props.title}
          <span style={{fontSize:"0.6em"}}>{this.props.description}</span>
        </TableRowColumn>
        <TableRowColumn>
          <TextField
                name={this.state.model._id}
                value={this.state.model.value}
                onChange={this.onChange.bind(this)}/>
        </TableRowColumn>
      </TableRow>
    );
  }
  onChange(ev) {
    let model = this.state.model;
    model.value = ev.target.value;
    model.save();
    this.setState({model});
  }
  static propTypes = {
    title:       PropTypes.string.isRequired,
    description: PropTypes.string,
    model:       PropTypes.string.isRequired
  }
}
