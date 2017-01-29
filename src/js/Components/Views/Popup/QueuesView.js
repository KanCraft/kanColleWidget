import React, {Component, PropTypes} from "react";

import Config from "../../Models/Config";
import {MISSION,RECOVERY,CREATESHIP} from "../../../Constants";

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
        case MISSION:    return `第${this.props.queue.deck}艦隊`;
        case RECOVERY:   return `第${this.props.queue.dock}修復ドック`;
        case CREATESHIP: return `第${this.props.queue.dock}建造ドック`;
        default: return `${this.props.queue.params} is unknown type for queue`;
        }
    }
    static propTypes = {
        queue: PropTypes.object.isRequired,
    }
}

export class QueueList extends Component {
    render() {
        const items = this.props.queues.sort(this.props.sort || ((prev, next) => {
            return (prev.deck || prev.dock) > (next.deck || next.dock);
        })).map((queue, i) => {
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
        unit:   PropTypes.string,
        sort:   PropTypes.func,
    }
}

export class SeparatedQueuesViewBase extends Component {
    render() {
        return (
          <div style={{display: "flex"}}>
            <QueueList queues={this.props.queues[MISSION].queues}    sort={this.sort} title={"遠征"} unit={"艦隊"} />
            <QueueList queues={this.props.queues[RECOVERY].queues}   sort={this.sort} title={"修復"} unit={"dock"} />
            <QueueList queues={this.props.queues[CREATESHIP].queues} sort={this.sort} title={"建造"} unit={"dock"} />
          </div>
        );
    }
    static propTypes = {
        queues: PropTypes.object.isRequired,
    }
}

export class SeparatedIDsQueuesView extends SeparatedQueuesViewBase {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        queues: PropTypes.object.isRequired
    }
}
export class SeparatedTimelineQueuesView extends SeparatedQueuesViewBase {
    constructor(props) {
        super(props);
        this.sort = (prev, next) => { return (prev.scheduled < next.scheduled) ? -1 : 1; };
    }
    static propTypes = {
        queues: PropTypes.object.isRequired
    }
}
export class MergedTimelineView extends Component {
    render() {
        const items = this.props.queues[MISSION].queues.concat(this.props.queues[RECOVERY].queues).concat(this.props.queues[CREATESHIP].queues).sort((prev, next) => {
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
