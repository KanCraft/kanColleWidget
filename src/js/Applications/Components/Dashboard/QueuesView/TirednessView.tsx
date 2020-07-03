import React from "react";
import Tiredness from "../../../Models/Queue/Tiredness";
import cn from "classnames";

export default class TirednessView extends React.Component<{
  upcomming: Tiredness[];
  now: Date;
}> {
  render() {
    const queues = this.props.upcomming;
    return (
      <div className="container">
        {queues.map(q => <div key={q.deck} className="columns">
          <div className="column col-2">第{q.deck}艦隊</div>
          {q.label ? <div className="column">{q.label}</div> : null}
          {this.renderBar(q)}
        </div>)}
      </div>
    );
  }
  renderBar(q: Tiredness) {
    const upto = this.props.now.upto(q.scheduled);
    const percentage = Math.floor(upto * 60 * 1000 * 100 / q.interval);
    return (
      <div className="column col-6 tiredness-bar-container">
        <div className="bar bar-sm">
          <div
            className={cn("bar-item", "tooltip", this.getColorClass(percentage))}
            data-tooltip={`疲労回復まであと${upto}分`}
            style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  }
  getColorClass(percentage: number): string {
    if (percentage < 10) return "bg-success";
    if (percentage < 60) return "bg-warning";
    return "bg-error";
  }
}