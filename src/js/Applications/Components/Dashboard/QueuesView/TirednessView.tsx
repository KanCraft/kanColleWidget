import React from "react";
import Tiredness from "../../../Models/Queue/Tiredness";

export default class TirednessView extends React.Component<{
  upcomming: Tiredness[];
  now: Date;
}> {
  render() {
    const queues = this.props.upcomming;
    return (
      <div className="container">
        {queues.map(q => <div key={q.deck} className="columns">
          <div className="column">第{q.deck}艦隊</div>
          <div className="column">あと{this.props.now.upto(q.scheduled)}</div>
        </div>)}
      </div>
    );
  }
}