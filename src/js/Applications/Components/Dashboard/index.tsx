import React from "react";

import {Scanned} from "../../Models/Queue/Queue";
import Mission from "../../Models/Queue/Mission";
import Recovery from "../../Models/Queue/Recovery";
import Shipbuilding from "../../Models/Queue/Shipbuilding";
import ClockView from "./ClockView";

export default class DashboardView extends React.Component<{}, {
  missions: Scanned<Mission>;
  recoveries: Scanned<Recovery>;
  shipbuildings: Scanned<Shipbuilding>;
  now: Date;
}> {

  private timerId: number;

  constructor(props) {
    super(props);
    this.state = {
      ...this.getQueues(),
      now: new Date(),
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  private getQueues() {
    return {
      missions: Mission.scan(),
      recoveries: Recovery.scan(),
      shipbuildings: Shipbuilding.scan(),
    };
  }
  private tick() {
    this.setState({
      ...this.getQueues(),
      now: new Date(),
    });
  }

  private getMergedList() {
    return {
      finished: Array.prototype.concat(
        this.state.missions.finished,
        this.state.recoveries.finished,
        this.state.shipbuildings.finished,
      ).sort((p, n) => p.scheduled < n.scheduled ? -1 : 1),
      upcoming: Array.prototype.concat(
        this.state.missions.upcomming,
        this.state.recoveries.upcomming,
        this.state.shipbuildings.upcomming,
      ).sort((p, n) => p.scheduled < n.scheduled ? -1 : 1),
    };
  }

  // TODO: どっかやって
  private getListItem(q: Mission | Recovery | Shipbuilding) {
    const scheduled = new Date(q.scheduled);
    switch (q.constructor) {
    case Mission:
      return (<div className="tile tile-centered" key={q._id}>
        <div className="tile-icon">
          <figure
            className="avatar"
            data-initial="遠征"
            style={{ backgroundColor: "#5755d9" }}></figure>
        </div>
        <div className="tile-content">
          <div className="tile-title">第{(q as Mission).deck}艦隊 {(q as Mission).title}</div>
          <small className="tile-subtitle">{scheduled.toLocaleTimeString()}</small>
        </div>
        {/* <div className="tile-action">
                        <button className="btn btn-link">
                            <i className="icon icon-more-vert"></i>
                        </button>
                    </div> */}
      </div>);
    case Recovery:
      return (<div className="tile tile-centered" key={q._id}>
        <div className="tile-icon">
          <figure
            className="avatar"
            data-initial="修復"
            style={{ backgroundColor: "#56c2c1" }}></figure>
        </div>
        <div className="tile-content">
          <div className="tile-title">第{(q as Recovery).dock}ドック</div>
          <small className="tile-subtitle">{scheduled.toLocaleTimeString()}</small>
        </div>
        {/* <div className="tile-action">
                        <button className="btn btn-link">
                            <i className="icon icon-more-vert"></i>
                        </button>
                    </div> */}
      </div>);
    case Shipbuilding:
      return (<div className="tile tile-centered" key={q._id}>
        <div className="tile-icon">
          <figure
            className="avatar"
            data-initial="建造"
            style={{ backgroundColor: "rgb(251, 152, 54)" }}></figure>
        </div>
        <div className="tile-content">
          <div className="tile-title">第{(q as Recovery).dock}ドック</div>
          <small className="tile-subtitle">{scheduled.toLocaleTimeString()}</small>
        </div>
        {/* <div className="tile-action">
                        <button className="btn btn-link">
                            <i className="icon icon-more-vert"></i>
                        </button>
                    </div> */}
      </div>);

    }
    return (
      <div className="tile tile-centered" key={q._id}>
        <div className="tile-icon">
          <figure
            className="avatar"
            data-initial={q.getQueueTypeLabel()}
            style={{ backgroundColor: "#5755d9" }}></figure>
        </div>
        <div className="tile-content">
          <div className="tile-title">{q.getTimerLabel()}</div>
          <small className="tile-subtitle">{new Date(q.scheduled).toLocaleTimeString()}</small>
        </div>
        <div className="tile-action">
          <button className="btn btn-link">
            <i className="icon icon-more-vert"></i>
          </button>
        </div>
      </div>
    );
  }

  private getListViewForQueues() {
    const { finished, upcoming } = this.getMergedList();
    console.log(upcoming);
    return (
      <div>
        {finished.map(q => this.getListItem(q))}
        {upcoming.map(q => this.getListItem(q))}
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <ClockView now={this.state.now} />
        <div>
          {this.getListViewForQueues()}
        </div>
      </div>
    );
  }
}