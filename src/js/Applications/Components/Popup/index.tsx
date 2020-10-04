import React, {Component} from "react";

import LaunchTrigger from "./LaunchTrigger";
import IconMenu from "./IconMenu";
import TwitterSetting from "../../Models/Settings/TwitterSetting";
import OfficialTwitterView from "./OfficialTwitter";

export default class PopupPage extends Component {
  render() {
    const { displayOfficialTwitter } = TwitterSetting.user();
    return (
      <div className="container popup" style={{width: "320px"}}>
        <LaunchTrigger />
        <IconMenu />
        {displayOfficialTwitter ? <OfficialTwitterView /> : null}
      </div>
    );
  }
}
