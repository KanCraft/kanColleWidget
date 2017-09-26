import React, {Component} from "react";
import PropTypes from "prop-types";

export default class Detail extends Component {
  render() {
    return (
      <div style={{whiteSpace:"pre-line"}}>
        <span style={{fontSize: "0.6em"}}>
          {this.props.children}
        </span>
      </div>
    );
  }
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
  }
}
