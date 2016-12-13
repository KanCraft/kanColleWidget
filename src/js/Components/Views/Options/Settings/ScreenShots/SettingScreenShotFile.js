import React, {Component} from "react";

import {TableRow, TableRowColumn} from "material-ui/Table";
import TextField                  from "material-ui/TextField";
import Config                     from "../../../../Models/Config";

const styles = {
    select: {
        background:   "transparent",
        width:        "60px",
        padding:      "7px",
        fontSize:     "1.25em",
        borderRadius: "0",
        border:       "none",
        borderBottom: "1px solid #ddd",
        cursor:       "pointer",
        WebkitAppearance: "none",
    }
};
export default class SettingScreenShotFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: Config.find("download-file-name"),
            ext:  Config.find("download-file-ext"),
        };
    }
    render() {
        return (
          <TableRow>
            <TableRowColumn>
              スクショファイル名
            </TableRowColumn>
            <TableRowColumn>
              <TextField name="name" value={this.state.name.value} onChange={this.onNameChange.bind(this)}/>
              <select style={styles.select} value={this.state.ext.value} onChange={this.onExtChange.bind(this)}>
                <option value="png">.png</option>
                <option value="jpeg">.jpeg</option>
              </select>
            </TableRowColumn>
            <TableRowColumn>
            </TableRowColumn>
          </TableRow>
        );
    }
    onNameChange(ev) {
        let name = this.state.name;
        name.value = ev.target.value;
        name.save();
        this.setState({name});
    }
    onExtChange(ev) {
        let ext = this.state.ext;
        ext.value = ev.target.value;
        ext.save();
        this.setState({ext});
        ev.target.blur();
    }
}
