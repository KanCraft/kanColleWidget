import React, {Component, PropTypes} from "react";

import {grey500, orange500, tealA200} from "material-ui/styles/colors";

import Achievement from "../../../../Models/Achievement";
import Quest, {YET,NOW,DONE,HIDDEN} from "../../../../Models/Quest";

class AchievementView extends Component {
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

class QuestStatus extends Component {
    style() {
        const styles = {
            base:     {padding:"2px"},
            [YET]:    {color: grey500},
            [NOW]:    {backgroundColor: orange500},
            [DONE]:   {backgroundColor: tealA200},
            [HIDDEN]: {},
        };
        return {...styles.base, ...styles[this.props.quest.state]};
    }
    render() {
        switch (this.props.quest.state) {
        case YET:    return <span style={this.style()}>[未着手]</span>;
        case NOW:    return <span style={this.style()}>進行中</span>;
        case DONE:   return <span style={this.style()}>完了</span>;
        case HIDDEN: return <span style={this.style()}>非表示</span>;
        }
    }
    static propTypes = {
        quest: PropTypes.object.isRequired,
    }
}

class QuestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daily: Quest.daily(false),
        };
    }
    render() {
        console.log(this.state.daily);
        return (
            <table style={{width: "96%"}}>
              <tbody>
                <tr><th colSpan="2">任務進捗</th></tr>
                {this.state.daily.map(quest => {
                    return (
                        <tr key={quest.id}>
                            <td>{quest.title}</td>
                            <td><QuestStatus quest={quest}/></td>
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
              <div style={{flex:"2"}}>
                <QuestView />
              </div>
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
