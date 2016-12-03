import React, {Component,PropTypes} from "react";

import {Table, TableBody} from "material-ui/Table";

import SettingText from "./SettingText";

import Icon from "../../FontAwesome";

export default class SettingsView extends Component {
    render() {
        return (
          <div>
            <h1 style={this.props.styles.title}><Icon name="cog" /> なんかもろもろ</h1>
            <Table>
              <TableBody>
                <SettingText
                  title="スクショのダウンロードフォルダ"
                  model="download-folder" />
              </TableBody>
            </Table>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired
    }
}
