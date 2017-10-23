import React, {Component} from "react";

import DashboardContents from "./Contents";
import {MenuNavigation}  from "./Navigation";

import Config from "../../Models/Config";

export default class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    this.layout = Config.find("dashboard-layout").value;
  }
  render() {
    return (
      <div>
        <DashboardContents
              index={this.state.index}
              layout={this.layout}
              shouldShowContentOfIndex={this.shouldShowContentOfIndex.bind(this)} />
        {this.layout == "tab" ? <MenuNavigation
              index={this.state.index}
              select={this.select.bind(this)} /> : null}
      </div>
    );
  }
  select(index) {
    this.setState({index});
  }
  shouldShowContentOfIndex(index) {
    if (this.layout == "scroll") return true;
    return this.state.index == index;
  }
}
