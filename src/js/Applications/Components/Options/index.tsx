import React, { Component } from "react";

import NotificationSettings from "./Notifications";
import ScreenshotSettingView from "./Screenshot";
import DamageSnapshotSettingView from "./DamageSnapshot";
import InAppButtonSettingView from "./InAppButton";

// webpack.config.jsの、DefinePluginを参照
declare let NODE_ENV;
import Debugger from "./Debugger";

export default class OptionsPage extends Component {
  render() {
    return (
      <div className="container options">
        <NotificationSettings />
        <DamageSnapshotSettingView />
        <ScreenshotSettingView />
        <InAppButtonSettingView />
        {NODE_ENV == "production" ? null : <Debugger />}
      </div>
    );
  }
}