import React, { Component } from "react";

// もっと設定項目が増えてきたら、これは"Settings"じゃなくてXxxSettingsとなるのが望ましい
import SettingsView   from "./Settings";
import WinconfigsView from "./Winconfigs";
import DebugView      from "./Debug";

const styles = {
    title: {
        fontSize: "2em"
    }
};

export default class OptionsView extends Component {
    render() {
        return (
          <div>
            <SettingsView   styles={styles} />
            <WinconfigsView styles={styles} />
            <DebugView      styles={styles} />
          </div>
        );
    }
}
