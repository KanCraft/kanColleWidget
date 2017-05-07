import React, {Component} from "react";

import {grey400} from "material-ui/styles/colors";

import KanColleDate from "../../../../Services/KanColleDate";
import Quest, {DONE, HIDDEN, NOW, YET} from "../../../../Models/Quest";
import QuestStatus from "./QuestStatus";

import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";

class QuestClearView extends Component {
  render() {
    const styles = {
      outline: {
        width: "96%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
      title: {
        textAlign: "center",
      },
      container: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      done: {
        color: grey400,
        width:  "80px",
        height: "80px",
      }
    };
    return (
      <div style={styles.outline}>
        <div style={styles.title}>
          <b>本日の任務は全て達成されました</b>
        </div>
        <div style={styles.container}>
          <img src="/dest/img/congrats/0.png" style={{width:"74%",cursor:"pointer"}} onClick={() => window.open("http://roonyan.com")}/>
        </div>
      </div>
    );
  }
}

export default class QuestView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daily: this.getQuests(),
      open:  false,
      questOnManual: {},
    };
  }
  getQuests() {
    return Quest.daily(false).filter(q => q.state != HIDDEN);
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({daily: this.getQuests()});
    }, 2 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  showDialog(quest) {
    if (quest.state == DONE) {
      quest.update({state: HIDDEN});
      this.setState({daily: this.getQuests()});
    } else {
      this.setState({questOnManual: quest});
    }
  }
  _handleDialogClose() {
    this.setState({questOnManual: {}});
  }
  updateStatus(state) {
    this.state.questOnManual.update({state});
    this.setState({questOnManual: {}});
  }
  caret() {
    return (
      <span style={{color: grey400}}>▸</span>
    );
  }
  render() {
    if (this.state.daily.length == 0) return <QuestClearView />;
    let now = new KanColleDate();
    return (
      <table style={{width: "96%"}}>
        <tbody>
          <tr><th colSpan="2">任務進捗 <span style={{fontWeight:"200"}}>/ {now.timeLeftToNextUpdate()}</span></th></tr>
          {this.state.daily.map(quest => {
            return (
              <tr
                key={quest.id} style={{cursor:"pointer"}}
                onClick={() => this.showDialog(quest)}>
                <td>{this.caret()} {quest.title}</td>
                <td><QuestStatus quest={quest}/></td>
              </tr>
            );
          })}
        </tbody>
        <Dialog
          open={!!this.state.questOnManual._id}
          onRequestClose={this._handleDialogClose.bind(this)}
        >
          <div>
            <div>
              <h5 style={{marginTop:0}}>{this.state.questOnManual.title}</h5>
            </div>
            <div>
              <RaisedButton label="未着手" onClick={this.updateStatus.bind(this, YET)}/>
              <RaisedButton label="遂行中" onClick={this.updateStatus.bind(this, NOW)}/>
              <RaisedButton label="達成"  onClick={this.updateStatus.bind(this, DONE)}/>
            </div>
          </div>
        </Dialog>
      </table>
    );
  }
}
