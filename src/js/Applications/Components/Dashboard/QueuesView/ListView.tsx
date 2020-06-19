import React from "react";
import { Scanned } from "../../../Models/Queue/Queue";
import Mission from "../../../Models/Queue/Mission";
import Recovery from "../../../Models/Queue/Recovery";
import Shipbuilding from "../../../Models/Queue/Shipbuilding";

export default class ListView extends React.Component<{
  missions: Scanned<Mission>,
  recoveries: Scanned<Recovery>,
  shipbuildings: Scanned<Shipbuilding>,
}> {

  private getMergedList() {
    return {
      finished: Array.prototype.concat(
        this.props.missions.finished,
        this.props.recoveries.finished,
        this.props.shipbuildings.finished,
      ).sort((p, n) => p.scheduled < n.scheduled ? -1 : 1),
      upcoming: Array.prototype.concat(
        this.props.missions.upcomming,
        this.props.recoveries.upcomming,
        this.props.shipbuildings.upcomming,
      ).sort((p, n) => p.scheduled < n.scheduled ? -1 : 1),
    };
  }

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

  render() {
    const { finished, upcoming } = this.getMergedList();
    return (
      <div>
        {finished.map(q => this.getListItem(q))}
        {upcoming.map(q => this.getListItem(q))}
      </div>
    );
  }
}