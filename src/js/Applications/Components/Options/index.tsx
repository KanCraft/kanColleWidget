import React, { Component } from "react";

import NotificationSettings from "./Notifications";
import ScreenshotSettingView from "./Screenshot";
import DamageSnapshotSettingView from "./DamageSnapshot";
import InAppButtonSettingView from "./InAppButton";

// webpack.config.jsの、DefinePluginを参照
declare let NODE_ENV;
import Debugger from "./Debugger";
import AnnounceView from "./Announce";
import DashboardDesignView from "./DashboardDesign";
import FrameSettingView from "./Frames";

export default class OptionsPage extends Component {
  render() {
    return (
      <div className="container options">
        <AnnounceView />
        <NotificationSettings />
        <FrameSettingView />
        <DashboardDesignView />
        <DamageSnapshotSettingView />
        <ScreenshotSettingView />
        <InAppButtonSettingView />
        {NODE_ENV == "production" ? null : <Debugger />}
      </div>
    );
  }
}