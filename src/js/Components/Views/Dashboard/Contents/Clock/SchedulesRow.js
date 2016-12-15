import React, {Component,PropTypes} from "react";
import {Client}          from "chomex";

import {ScheduledQueues} from "../../../../Models/Queue/Queue";
import ManualTimerDialog from "../Dialogs/ManualTimerDialog";

class Schedule extends Component {
    render() {
        const styles = {
            row: {display:"flex", alignItems:"center",cursor:"pointer"},
            col: {flex: "1"}
        };
        const name = `第${this.props.index + 1}${this.props.unit}`;
        const time = this.props.queue.scheduled ? (new Date(this.props.queue.scheduled)).toClockString() : "--:--";
        return (
          <div style={styles.row} onClick={() => this.props.manual(this.props.queue, this.props.index + 1)}><div style={styles.col}>{time}</div><div style={styles.col}>{name}</div></div>
        );
    }
    static propTypes = {
        index: PropTypes.number.isRequired,
        unit:  PropTypes.string.isRequired,
        queue: PropTypes.object.isRequired,
        manual:PropTypes.func.isRequired,
    }
}

export default class SchedulesRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queues: ScheduledQueues.dict(),
            queue:  null,
        };
        this.openManualDialog = this.openManualDialog.bind(this);
        this.client = new Client(chrome.runtime);
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
        this.setState({queues: ScheduledQueues.dict()});
    }
    openManualDialog(queue, identifier) {
        queue.identifier = identifier;
        this.setState({queue});
    }
    commitManualDialg(time) {
        return this.client.message("/queues/manual", {queue: this.state.queue, time});
    }
    render() {
        // console.log(this.state.queues);
        const col = {
            listStyleType: "none",
            padding:       "0 32px 0 0",
            flex:          "1",
        };
        return (
          <div style={{display: "flex", marginBottom: "12px"}}>
            <div style={col}>
              {this.state.queues.missions.map((m,i) => {
                  return <Schedule queue={m} key={i} index={i} unit={"艦隊"} manual={this.openManualDialog}/>;
              })}
            </div>
            <div style={col}>
              {this.state.queues.recoveries.map((r, i) => {
                  return <Schedule queue={r} key={i} index={i} unit={"修復"} manual={this.openManualDialog}/>;
              })}
            </div>
            <div style={col}>
              {this.state.queues.createships.map((c, i) => {
                  return <Schedule queue={c} key={i} index={i} unit={"建造"} manual={this.openManualDialog}/>;
              })}
            </div>
            <ManualTimerDialog
              onCommit={this.commitManualDialg.bind(this)}
              open={!!this.state.queue}
              queue={this.state.queue}
              close={() => this.setState({queue: null})}
              />
          </div>
        );
    }
}
