import React from "react";
import cn from "classnames";
import Queue, { Scanned } from "../../../Models/Queue/Queue";
import Mission from "../../../Models/Queue/Mission";
import Recovery from "../../../Models/Queue/Recovery";
import Shipbuilding from "../../../Models/Queue/Shipbuilding";

class CellModel<T extends Queue = Mission | Recovery | Shipbuilding> {
  constructor(public index: number, public queue: T) {
  }
  getScheduledTime(): string {
    if (!this.queue) return "--:--";
    return (new Date(this.queue.scheduled)).toKCWTimeString();
  }
  getTooltipAttributes(): { className?: string, data?: string } {
    if (!this.queue) return {};
    return {className: "tooltip", data: this.queue.getTimerLabel()};
  }
}

export default class MatrixView extends React.Component<{
  missions: Scanned<Mission>,
  recoveries: Scanned<Recovery>,
  shipbuildings: Scanned<Shipbuilding>,
}> {

  getColumn<T>(label: string, cells: CellModel[]) {
    return (
      <div className={cn("container", "column", label)}>
        <div className="columns">
          <div className="column col-3"></div>
          <div className="column col-9">{/* label */}</div>
        </div>
        {cells.map(cell => {
          const tooltip = cell.getTooltipAttributes();
          return (
            <div className="columns" key={cell.index}>
              <div className="column col-3">{cell.index}</div>
              <div
                className={cn("column", "col-9", tooltip.className)}
                data-tooltip={tooltip.data}
              >{cell.getScheduledTime()}</div>
            </div>
          );
        })}
      </div>
    );
  }

  populateCells<T extends Queue = Mission | Recovery | Shipbuilding>(scanned: Scanned<T>): CellModel<T>[] {
    const cells: CellModel<T>[] = [];
    const queues = scanned.upcomming;
    const maxlen = 4; // FIXME: 今後これ変わらんかね？
    for (let i = 1; i <= maxlen; i++) {
      const queue = queues.find(q => q.registeredOn(i));
      cells.push(new CellModel<T>(i, queue));
    }
    return cells;
  }

  render() {
    const { missions, recoveries, shipbuildings } = this.props;
    return (
      <div className="queue-matrix container">
        <div className="columns">
          {this.getColumn("遠征", this.populateCells(missions))}
          {this.getColumn("修復", this.populateCells(recoveries))}
          {this.getColumn("建造", this.populateCells(shipbuildings))}
        </div>
      </div>
    );
  }
}