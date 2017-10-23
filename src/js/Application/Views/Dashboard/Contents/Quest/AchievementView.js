import React, {Component} from "react";

import Achievement from "../../../../Models/Achievement";

export default class AchievementView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daily: Achievement.daily(),
      weekly: Achievement.weekly(),
      interval: null,
    };
  }
  componentDidMount() {
    this.setState({
      interval: setInterval(() => {
        // FIXME: なんかこれキモいけどとりあえず
        this.setState({
          daily: Achievement.daily(),
          weekly: Achievement.weekly(),
        });
      }, 1000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  render() {
    return (
      <table style={{width:"80%", textAlign:"center"}}>
        <tbody>
          <tr><td></td><th>今日</th><th>今週</th></tr>
          {Object.keys(this.state.daily.records).map(key => {
            return (
              <tr key={key}>
                <th>{this.state.daily.records[key].name}</th>
                <td>{this.state.daily.records[key].count}</td>
                <td>{this.state.weekly.records[key].count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
