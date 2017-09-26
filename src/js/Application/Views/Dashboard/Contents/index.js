import React, {Component} from "react";
import PropTypes from "prop-types";

import DashboardClock from "./Clock";
import DashboardQuest from "./Quest";
import DashboardStatistics from "./Statistics";
import DashboardMemo  from "./Memo";



export default class DashboardContents extends Component {
  render() {
    return (
      <div>
        <DashboardClock      style={this.display(0)} />
        <DashboardQuest      style={this.display(1)} />
        <DashboardMemo       style={this.display(2)} />
        <DashboardStatistics style={this.display(3)} />
      </div>
    );
  }
  display(index) {
    return {
      display: (this.props.shouldShowContentOfIndex(index)) ? "" : "none",
      padding: (this.props.layout == "tab") ? "12px 36px 12px 12px" : "12px",
    };
  }
  static propTypes = {
    shouldShowContentOfIndex: PropTypes.func.isRequired,
    layout: PropTypes.string.isRequired,
  }
}
