import React, {Component, PropTypes} from "react";

import Config from "../../Models/Config";

class QueueListItem extends Component {
    render() {
        const rest = Config.find("time-format").value == "rest";
        const date = new Date(this.props.queue.scheduled);
        const name = "第" + (this.props.queue.deck || this.props.queue.dock) + this.props.unit;
        return (
          <div>
            <span>{name}</span> <span>{date.toClockString(rest)}</span>
          </div>
        );
    }
    static propTypes = {
        queue: PropTypes.object.isRequired,
        unit:  PropTypes.string.isRequired
    }
}

export class TLQueueEntry extends Component {
    render() {
        const rest = Config.find("time-format").value == "rest";
        const scheduled = new Date(this.props.queue.scheduled);
        return (
            <div>
                <span style={{marginRight: "2px"}}>{scheduled.toClockString(rest)}</span>
                <span style={{marginRight: "2px", color: this.props.queue.badgeColor}}>▸</span>
                <span style={{marginRight: "2px", textDecoration: "underline"}}>{this.getIdentity()}</span>
                <span style={{fontSize:"0.8em"}}>{this.props.queue.title ? this.props.queue.title : null}</span>
            </div>
        );
    }
    getIdentity() {
        switch (this.props.queue.params.type) {
        case "mission": return `第${this.props.queue.deck}艦隊`;
        case "recovery": return `第${this.props.queue.dock}修復ドック`;
        case "createship": return `第${this.props.queue.dock}建造ドック`;
        default: return `${this.props.queue.params} is unknown type for queue`;
        }
    }
    static propTypes = {
        queue: PropTypes.object.isRequired,
    }
}

export class QueueList extends Component {
    render() {
        const items = this.props.queues.sort((prev, next) => {
            return (prev.deck || prev.dock) > (next.deck || next.dock);
        }).map((queue, i) => {
            return <QueueListItem key={i} queue={queue} unit={this.props.unit} />;
        });
        return (
          <div style={{flex: 1}}>
            <div style={{fontWeight: "bold"}}>{this.props.title}</div>
            {items}
          </div>
        );
    }
    static propTypes = {
        title:  PropTypes.string,
        queues: PropTypes.array,
        unit:   PropTypes.string
    }
}

export class HorizontalQueuesView extends Component {
    render() {
        return (
          <div style={{display: "flex"}}>
            <QueueList queues={this.props.queues.missions.queues}    title={"遠征"} unit={"艦隊"} />
            <QueueList queues={this.props.queues.recoveries.queues}  title={"修復"} unit={"dock"} />
            <QueueList queues={this.props.queues.createships.queues} title={"建造"} unit={"dock"} />
          </div>
        );
    }
    static propTypes = {
        queues: PropTypes.object.isRequired
    }
}
export class VerticalTimelineView extends Component {
    render() {
        const items = this.props.queues.missions.queues.concat(this.props.queues.recoveries.queues).concat(this.props.queues.createships.queues).sort((prev, next) => {
            return prev.scheduled < next.scheduled ? -1 : 1;
        }).map((q, i) => <TLQueueEntry key={i} queue={q} />);
        return (
              <div style={{marginBottom: "8px"}}>{items}</div>
        );
    }
    static propTypes = {
        queues: PropTypes.object.isRequired
    }
}
