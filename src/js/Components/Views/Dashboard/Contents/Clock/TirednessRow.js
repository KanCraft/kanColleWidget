import React, {Component} from "react";

import LinearProgress from "material-ui/LinearProgress";
import {red600, orange400, limeA200, lightGreenA400} from "material-ui/styles/colors";

import {ScheduledQueues} from "../../../../Models/Queue/Queue";
import Config from "../../../../Models/Config";

export default class TirednessRow extends Component {
  constructor(props) {
    super(props);
    this.state = {tiredness: ScheduledQueues.find("tiredness").queues};
    this.duration = Config.find("notification-for-tiredness").time * (1000 * 60);
  }
  componentDidMount() {
    this.setState({
      interval: setInterval(this.update.bind(this), 2000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  update() {
    this.setState({tiredness: ScheduledQueues.find("tiredness").queues});
  }
  getRow(t, i) {
    return (
      <div key={i}>
        <span>{this.getText(t)}</span> <LinearProgress color={this.getColor(t)} mode="determinate" value={this.getProgress(t)}/>
      </div>
    );
  }
  getText(t) {
    if (t.deck < 5) {
      return `第${t.deck}艦隊疲労 ${(new Date(t.scheduled)).toRemainingMinutes()}分`;
    }
    const d = new Date(t.deck);
    return `${d.toClockString()}出撃編成 ${(new Date(t.scheduled)).toRemainingMinutes()}分`;
  }
  getColor(t) {
    let p = this.getProgress(t);
    if (p < 25) return lightGreenA400;
    if (p < 5)  return limeA200;
    if (p < 75) return orange400;
    return red600;
  }
  getProgress(t) {
    let diff = t.scheduled - Date.now();
    let r = (diff * 100) / this.duration;
    return r;
  }
  render() {
    return (
      <div style={{paddingRight: "30px"}}>
        {this.state.tiredness.map(this.getRow.bind(this))}
      </div>
    );
  }
}
