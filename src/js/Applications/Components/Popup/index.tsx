import React, {Component} from "react";

import LaunchTrigger from "./LaunchTrigger";
import IconMenu from "./IconMenu";

export default class PopupPage extends Component {
  render() {
    return (
      <div className="container popup" style={{width: "320px"}}>
        <LaunchTrigger />
        <IconMenu />
      </div>
    );
  }
}
