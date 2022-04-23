import React from "react";
import Tiredness from "../../../Models/Queue/Tiredness";
import cn from "classnames";
import TirednessTimerSetting, {ClickAction} from "../../../Models/Settings/TirednessTimerSetting";

export default class TirednessView extends React.Component<{
  upcomming: Tiredness[];
  now: Date;
}> {
  render() {
    const queues = this.props.upcomming;
    const clickAction = (q: Tiredness) => {
      switch (TirednessTimerSetting.user().clickAction) {
        case ClickAction.RemoveConfirm:
          return window.confirm("このタイマーを削除しますか？\nTODO: ほんとはModalを使うべき") ? q.delete() : null;
        case ClickAction.RemoveSilently:
          return q.delete();
      }
    };
    return (
      <div className="container">
        {queues.map(q => <div key={q._id} className="columns c-hand" onClick={() => {
           clickAction(q);
        }}>
          <div className="column col-auto">第{q.deck}艦隊</div>
          {q.label ? <div className="column col-auto">{q.label} {TirednessTimerSetting.user().clickAction}</div> : null}
          {this.renderBar(q)}
        </div>)}
      </div>
    );
  }
  renderBar(q: Tiredness) {
    const upto = this.props.now.upto(q.scheduled);
    const diff = (q.scheduled - Date.now());
    const progress = Math.round(diff * 100 / q.interval);
    return (
      <div className="column tiredness-bar-container">
        <div className="bar">
          <div
            className={cn("bar-item", "tooltip", this.getColorClass(progress))}
            data-tooltip={`疲労回復まであと${upto.minutes}分`}
            style={{ width: `${progress}%` }}
          >{upto.minutes.pad(2)}:{upto.seconds.pad(2)}</div>
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