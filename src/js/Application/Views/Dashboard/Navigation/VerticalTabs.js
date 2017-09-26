import React, {Component} from "react";
import PropTypes from "prop-types";

import {grey200, grey300, grey600} from "material-ui/styles/colors";

const bar = {
  position:      "fixed",
  top:           "0",
  right:         "0",
  height:        "100%",
  display:       "flex",
  flexDirection: "column",
  width:         "48px",
  alignItems:    "center",
};

export class VTabs extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={bar}>
        {this.props.children.map(this.cloneItem.bind(this))}
      </div>
    );
  }
  cloneItem(item, i) {
    return React.cloneElement(item, {
      onTouchTap: () => {},
      key: i,
      selected: i == this.props.selectedIndex,
      index: i,
      onItemSelected: this.props.onItemSelected,
    });
  }
  static propTypes = {
    selectedIndex: PropTypes.number.isRequired,
    children:      PropTypes.node.isRequired,
    onItemSelected:PropTypes.func.isRequired,
  }
}

const item = {
  base: {
    flex:          "1",
    display:       "flex",
    flexDirection: "column",
    justifyContent:"center",
    alignItems:    "center",
    width:         "100%",
    height:        "100%",
    cursor:        "pointer",
    transition:    "all 0.1s",
  }
};
export class VTabItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
  }
  render() {
    return (
      <div
              style={{...item.base, ...this.style()}}
              onMouseEnter={this.onMouseEnter.bind(this)}
              onMouseLeave={this.onMouseLeave.bind(this)}
              onClick={() => this.props.onItemSelected(this.props.index)}
              >
        {this.getClonedIcon()}
      </div>
    );
  }
  onMouseEnter() {
    this.setState({hovered:true});
  }
  onMouseLeave() {
    this.setState({hovered:false});
  }
  style() {
    if (this.props.selected) return {};
    if (this.state.hovered) return {backgroundColor: grey300};
    return {backgroundColor: grey200};
  }
  getClonedIcon() {
    return React.cloneElement(this.props.icon, {
      color: this.props.selected ? grey600 : grey600
    });
  }
  static propTypes = {
    icon:           PropTypes.node,
    selected:       PropTypes.bool,
    index:          PropTypes.number,
    onItemSelected: PropTypes.func,
  }
}
