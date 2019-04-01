import React, { Component } from "react";

import Simulator from "./Simulator";

export default class DebuggerView extends Component {
  render() {
    return (
      <div className="category">
        <h1>Dev Debugger</h1>
        <Simulator />
      </div>
    );
  }
}
