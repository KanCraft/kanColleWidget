import React, {Component,PropTypes} from "react";

import {ScheduledQueues} from "../../../../Models/Queue/Queue";

class Schedule extends Component {
    render() {
        const styles = {
            row: {display:"flex", alignItems:"center"},
            col: {flex: "1"}
        };
        const name = `第${this.props.index + 1}${this.props.unit}`;
        const time = this.props.queue.scheduled ? (new Date(this.props.queue.scheduled)).toClockString() : "--:--";
        return (
          <div style={styles.row}><div style={styles.col}>{time}</div><div style={styles.col}>{name}</div></div>
        );
    }
    static propTypes = {
        index: PropTypes.number.isRequired,
        unit:  PropTypes.string.isRequired,
        queue: PropTypes.object.isRequired,
    }
}

export default class SchedulesRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queues: ScheduledQueues.dict()
        };
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
                  return <Schedule queue={m} key={i} index={i} unit={"艦隊"}/>;
              })}
            </div>
            <div style={col}>
              {this.state.queues.recoveries.map((r, i) => {
                  return <Schedule queue={r} key={i} index={i} unit={"修復"}/>;
              })}
            </div>
            <div style={col}>
              {this.state.queues.createships.map((c, i) => {
                  return <Schedule queue={c} key={i} index={i} unit={"建造"}/>;
              })}
            </div>
          </div>
        );
    }
}
