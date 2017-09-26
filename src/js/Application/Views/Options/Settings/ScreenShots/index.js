import React, {Component} from "react";
import PropTypes from "prop-types";

import {Table, TableBody} from "material-ui/Table";

import SettingText   from "../SettingText";
import SettingSwitch from "../SettingSwitch";
import SettingScreenShotFile from "./SettingScreenShotFile";

import Settings      from "material-ui/svg-icons/action/settings";

export default class ScreenShotSettingsView extends Component {
  render() {
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> スクショ設定</h1>
        <Table>
          <TableBody>
            <SettingText
                  title="スクショのダウンロードフォルダ"
                  model="download-folder" />
            <SettingSwitch
                  title="スクショしたらそのままダウンロードする"
                  model="directly-download-on-capture" />
            <SettingSwitch
                  title="スクショしたら必ず中型にリサイズする"
                  detail="プレー画面がどんなサイズであっても800x480にリサイズします。当然、その過程で画像劣化する可能性があります。"
                  model="force-capture-default-size" />
            <SettingScreenShotFile />
          </TableBody>
        </Table>
      </div>
    );
  }
  static propTypes = {
    styles: PropTypes.object.isRequired
  }
}
