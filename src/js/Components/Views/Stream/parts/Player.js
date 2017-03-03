import React, {Component, PropTypes} from "react";

export default class VideoPlayer extends Component {
  render() {
    return <video style={{width: "100%"}} src={this.props.src} autoPlay="true"/>;
  }
  static propTypes = {
    src: PropTypes.string
  }
}
