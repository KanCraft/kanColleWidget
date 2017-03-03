import React from "react";

export default class Row extends React.Component {
  render() {
    const style = {
      display:      "flex",
      marginBottom: "24px",
    };
    return (
      <div style={{...style, ...this.props.style}}>
        {this.props.children}
      </div>
    );
  }
  static propTypes = {
    style:    React.PropTypes.object,
    children: React.PropTypes.node.isRequired,
  }
  static defaultProps = {
    style:    {},
  }
}
