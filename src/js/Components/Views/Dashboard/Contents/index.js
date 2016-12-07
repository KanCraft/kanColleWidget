import React, {Component, PropTypes} from "react";

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
            <DashboardStatistics style={this.display(2)} />
            <DashboardMemo       style={this.display(3)} />
          </div>
        );
    }
    display(index) {
        return {
            display: (this.props.shouldShowContentOfIndex(index)) ? "" : "none",
            padding: "12px 36px 12px 12px",
        };
    }
    static propTypes = {
        shouldShowContentOfIndex: PropTypes.func.isRequired,
    }
}
