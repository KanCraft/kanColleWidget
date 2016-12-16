import React, {Component} from "react";

import {TableRow, TableRowColumn} from "material-ui/Table";
import TextField                  from "material-ui/TextField";
import SelectField                from "material-ui/SelectField";
import MenuItem                   from "material-ui/MenuItem";
import Config                     from "../../../../Models/Config";

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
              <div style={{display:"flex"}}>
                <div>
                  <TextField name="name" value={this.state.name.value} onChange={this.onNameChange.bind(this)}/>
                </div>
                <div>
                  <SelectField style={{maxWidth:"6em"}} value={this.state.ext.value} onChange={this.onExtChange.bind(this)}>
                    <MenuItem value="png"  primaryText=".png"/>
                    <MenuItem value="jpeg" primaryText=".jpeg"/>
                  </SelectField>
                </div>
              </div>
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
    onExtChange(ev, i, value) {
        let ext = this.state.ext;
        ext.value = value;
        ext.save();
        this.setState({ext});
    }
}
