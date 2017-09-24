import React, {Component, PropTypes} from "react";

import RaisedButton from "material-ui/RaisedButton";

export default class VideoControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      started:   Date.now(),
      now:       Date.now(),
    };
  }
  startRecording() {
    this.setState({
      recording: true,
      started: Date.now(),
      interval: setInterval(() => {
        this.setState({now: Date.now()});
      }, 17)
    });
    this.props.startRecording();
  }
  stopRecording() {
    this.setState({recording: false});
    this.props.stopRecording();
  }
  getButton() {
    if (this.state.recording) {
      return <RaisedButton
              label="STOP"
              fullWidth={true}
              onClick={this.stopRecording.bind(this)}
            />;
    } else {
      return <RaisedButton
              label="START"
              fullWidth={true}
              primary={true}
              onClick={this.startRecording.bind(this)}
            />;
    }
  }
  getInfo() {
    if (!this.state.recording) return null;
    const d = this.state.now - this.state.started;
    const s = Math.floor(d / 1000);
    const ms = d - (s * 1000);
    return (
      <div>
        <span style={{color:"white", fontFamily:"monospace"}}>{s}:{ms}</span>
      </div>
    );
  }
  render() {
    return (
      <div>
        <div style={{marginBottom: "24px"}}>
          <video style={{width: "100%"}} src={this.props.source} autoPlay="true" />
        </div>
        <div style={{marginBottom:"12px"}}>{this.getButton()}</div>
        <div style={{marginBottom:"12px"}}>{this.getInfo()}</div>
      </div>
    );
  }
  static propTypes = {
    client:         PropTypes.object.isRequired,
    startRecording: PropTypes.func.isRequired,
    stopRecording:  PropTypes.func.isRequired,
    source:         PropTypes.string.isRequired,
  }
}
