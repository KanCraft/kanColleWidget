import React, {Component} from "react";

import DashboardContents from "./Contents";
import {MenuNavigation}  from "./Navigation";

export default class DashboardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }
    render() {
        return (
          <div>
            <DashboardContents
              index={this.state.index}
              shouldShowContentOfIndex={this.shouldShowContentOfIndex.bind(this)} />
            <MenuNavigation
              index={this.state.index}
              select={this.select.bind(this)} />
          </div>
        );
    }
    select(index) {
        this.setState({index});
    }
    shouldShowContentOfIndex(index) {
        return this.state.index == index;
    }
}
