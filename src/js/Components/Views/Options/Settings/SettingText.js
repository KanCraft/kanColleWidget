import React, {Component, PropTypes} from "react";

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
            </TableRowColumn>
            <TableRowColumn>
              <TextField
                name={this.state.model._id}
                value={this.state.model.value}
                onChange={this.onChange.bind(this)}/>
            </TableRowColumn>
            <TableRowColumn>
              {this.props.description}
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
