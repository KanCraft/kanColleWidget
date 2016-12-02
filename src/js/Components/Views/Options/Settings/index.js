import React, {Component,PropTypes} from "react";

// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";

import Icon from "../../FontAwesome";

export default class SettingsView extends Component {
    render() {
        return (
          <div>
            <h1 style={this.props.styles.title}><Icon name="cog" /> なんかもろもろ</h1>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired
    }
}
