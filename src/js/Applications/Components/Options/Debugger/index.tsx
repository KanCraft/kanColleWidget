import React, { Component } from "react";

import Simulator from "./Simulator";
import DebugModeView from "./DebugModeView";

export default class DebuggerView extends Component {
  render() {
    return (
      <div className="category">
        <h1>Dev Debugger</h1>
        <DebugModeView />
        <Simulator />
      </div>
    );
  }
}
