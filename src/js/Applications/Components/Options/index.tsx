import React, { Component } from "react";

import AnnounceView from "./Announce";

import NotificationSettings from "./Notifications";
import DashboardDesignView from "./DashboardDesign";
import DamageSnapshotSettingView from "./DamageSnapshot";
import ScreenshotSettingView from "./Screenshot";
import TwitterAccountSettingView from "./TwitterAccount";
import InAppButtonSettingView from "./InAppButton";
import FrameSettingView from "./Frames";
import DeckCaptureSettingView from "./DeckCapture";

// {{{ webpack.config.jsの、DefinePluginを参照
declare let NODE_ENV;
import Debugger from "./Debugger";
// }}}

export default class OptionsPage extends Component {
  render() {
    return (
      <div className="container options">
        <AnnounceView />
        <NotificationSettings />
        <DashboardDesignView />
        <DamageSnapshotSettingView />
        <ScreenshotSettingView />
        <TwitterAccountSettingView />
        <InAppButtonSettingView />
        <FrameSettingView />
        <DeckCaptureSettingView />
        {NODE_ENV == "production" ? null : <Debugger />}
      </div>
    );
  }
}