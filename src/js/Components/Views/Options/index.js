import React, { Component } from "react";

import {init} from "../../../entrypoints/global-pollution";
init(window);

// もっと設定項目が増えてきたら、これは"Settings"じゃなくてXxxSettingsとなるのが望ましい
import NotificationSettingsView from "./Settings/Notifications";
import ScreenShotSettingsView   from "./Settings/ScreenShots";
import SyncSettingsView         from "./Settings/Syncs";
import PopupSettingsView        from "./Settings/Popup";
import WinconfigsView from "./Winconfigs";
// import DebugView      from "./Debug";

const styles = {
    title: {
        fontSize: "2em"
    }
};

export default class OptionsView extends Component {
    render() {
        return (
          <div>
            <NotificationSettingsView styles={styles} />
            <ScreenShotSettingsView   styles={styles} />
            <PopupSettingsView        styles={styles} />
            <SyncSettingsView         styles={styles} />
            <WinconfigsView           styles={styles} />
            {/* <DebugView            styles={styles} /> */}
          </div>
        );
    }
}
