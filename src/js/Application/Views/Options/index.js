/* global process:false */
import React, { Component } from "react";

import FlatButton from "material-ui/FlatButton";
import {init} from "../../../entrypoints/global-pollution";
init(window);

// もっと設定項目が増えてきたら、これは"Settings"じゃなくてXxxSettingsとなるのが望ましい
import NotificationSettingsView from "./Settings/Notifications";
import ScreenShotSettingsView   from "./Settings/ScreenShots";
import SyncSettingsView         from "./Settings/Syncs";
import TimerSettingsView        from "./Settings/Timer";
import TwitterSettingsView      from "./Settings/Twitter";
import InAppSettingsView        from "./Settings/InApp";
import StatisticsSettingsView   from "./Settings/Statistics";
import ServerSettingView        from "./Settings/Server";
import MastodonSettingView      from "./Settings/Mastodon";
import UncategorizedSettings    from "./Settings/Uncategorized";
import ExternalExtensionView    from "./Settings/External";
import Announcement   from "./Announcement";
import WinconfigsView from "./Winconfigs";
import ReferencesView from "./References";

import SimulatorView  from "./Simulator";

import Meta    from "../../../Services/Meta";
import History from "../../Models/History";

const styles = {
  title: {
    fontSize: "2em",
    display: "flex",
    alignItems: "center",
  }
};

export default class OptionsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: new Meta(History.find("update-checked")),
      ts:   Date.now(),// FIXME: これReactっぽくないなー
    };
  }
  update() {
    this.setState({ts: Date.now()});
  }
  render() {
    return (
      <div>
        {this.state.meta.hasUpdate() ?
          <Announcement meta={this.state.meta} update={this.update.bind(this)} /> :
          <div style={{textAlign:"right"}}>
            <FlatButton secondary={true} label="バグ報告・機能要望" onClick={() => location.href = "/dest/html/feedback.html#bug"} />
            <FlatButton primary={true} label="現在あがっているissue" onClick={() => location.href = "https://github.com/otiai10/kanColleWidget/issues?q=is%3Aissue"} />
          </div>
            }
        <NotificationSettingsView styles={styles} />
        <ScreenShotSettingsView   styles={styles} />
        <TimerSettingsView        styles={styles} />
        <SyncSettingsView         styles={styles} />
        <TwitterSettingsView      styles={styles} />
        <InAppSettingsView        styles={styles} />
        <StatisticsSettingsView   styles={styles} />
        <ExternalExtensionView    styles={styles} />
        <ServerSettingView        styles={styles} />
        <MastodonSettingView      styles={styles} />
        <UncategorizedSettings    styles={styles} />
        <WinconfigsView           styles={styles} />
        <ReferencesView           styles={styles} />
        {process.env.NODE_ENV == "production" ? null : <SimulatorView styles={styles} />}
      </div>
    );
  }
}
