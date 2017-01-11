import React, {Component, PropTypes} from "react";

import Achievement from "../../../../Models/Achievement";

class AchievementView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daily: Achievement.daily(),
            weekly: Achievement.weekly(),
        };
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

export default class DashboardQuest extends Component {
    render() {
        return (
          <div style={{...this.props.style}}>
            <div style={{display:"flex"}}>
              <div style={{flex:"1"}}></div>
              <div style={{flex:"1"}}>
                <AchievementView />
              </div>
            </div>
          </div>
        );
    }
    static propTypes = {
        style: PropTypes.object.isRequired,
    }
}
