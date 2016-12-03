import React, {Component, PropTypes} from "react";

class QueueListItem extends Component {
    render() {
        console.log(this.props.queue);
        const date = new Date(this.props.queue.scheduled);
        const name = "第" + (this.props.queue.deck || this.props.queue.dock) + this.props.unit;
        return (
          <div>
            <span>{name}</span> <span>{date.toClockString()}</span>
          </div>
        );
    }
    static propTypes = {
        queue: PropTypes.object.isRequired,
        unit:  PropTypes.string.isRequired
    }
}

class QueueList extends Component {
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

export default class QueuesView extends Component {

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
