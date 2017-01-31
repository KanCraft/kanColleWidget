import React, {Component, PropTypes} from "react";

import {TableRow, TableRowColumn} from "material-ui/Table";
import Toggle                     from "material-ui/Toggle";
import Config                     from "../../../Models/Config";
import Detail from "../Detail";

export default class SettingSwitch extends Component {
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
              {(this.props.detail) ? <Detail>{this.props.detail}</Detail> : null}
            </TableRowColumn>
            <TableRowColumn>
              <Toggle toggled={this.state.model.value} onToggle={this.onToggle.bind(this)}/>
            </TableRowColumn>
          </TableRow>
        );
    }
    onToggle() {
        let model = this.state.model;
        model.value = !model.value;
        model.save();
        this.setState({model});
    }
    static propTypes = {
        title:  PropTypes.string.isRequired,
        detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        model:  PropTypes.string.isRequired
    }
}
