import React, {Component} from "react";
import PropTypes from "prop-types";

class Row extends Component {
  render() {
    return (
      <div style={{display: "flex"}}>
        {this.props.children}
      </div>
    );
  }
  static propTypes = {
    children: PropTypes.any
  }
}
class Col extends Component {
  render() {
    return (
      <div style={{flex: 1}}>
        {this.props.children}
      </div>
    );
  }
  static propTypes = {
    children: PropTypes.any
  }
}

export {
  Row, Col
};
