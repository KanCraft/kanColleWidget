import React from "react";
import cn from "classnames";
import { Scanned, Kind } from "../../../Models/Queue/Queue";
import Mission from "../../../Models/Queue/Mission";
import Recovery from "../../../Models/Queue/Recovery";
import Shipbuilding from "../../../Models/Queue/Shipbuilding";
import TimerDisplaySetting, { DisplayFormat } from "../../../Models/Settings/TimerDisplaySetting";

class CellModel {
  draft: string; // マニュアル登録時のやつ
  constructor(public kind: Kind, public index: number, public queue: Mission | Recovery | Shipbuilding) {
    if (this.queue) {
      const upto = (new Date()).upto(this.queue.scheduled);
      this.draft = `${upto.hours.pad(2)}:${upto.minutes.pad(2)}`;
    } else {
      this.draft = "00:00";
    }
  }
  getDisplayTime(format: DisplayFormat): string {
    if (!this.queue) return "--:--";
    if (format == DisplayFormat.RemainingTIme) {
      const upto = (new Date()).upto(this.queue.scheduled);
      return `${upto.hours.pad(2)}:${upto.minutes.pad(2)}`;
    }
    return (new Date(this.queue.scheduled)).toKCWTimeString();
  }
  getTooltipAttributes(): { className?: string, data?: string } {
    if (!this.queue) return {};
    return {className: "tooltip", data: this.queue.getTimerLabel()};
  }
  identityText(): string {
    switch (this.kind) {
    case Kind.Mission: return `第${this.index}艦隊`;
    default: return `第${this.index}ドック`;
    }
  }
  commit() {
    const diff = this.getDiffTimeFromInput();
    const scheduled = Date.now() + diff;
    if (this.queue) return this.queue.update({ scheduled });
    switch (this.kind) {
    case Kind.Mission: return Mission.new<Mission>({ id: 0, deck: this.index, title: "マニュアル登録したやつ", time: diff }).register();
    case Kind.Recovery: return Recovery.new<Recovery>({ dock: this.index, time: diff }).register(scheduled);
    case Kind.Shipbuilding: return Shipbuilding.new<Shipbuilding>({ dock: this.index, time: diff }).register(scheduled);
    default: return;
    }
  }
  delete() {
    if (this.queue) return this.queue.delete();
  }
  private getDiffTimeFromInput(): number {
    const [hours, minutes] = this.draft.split(":").map(s => parseInt(s, 10));
    return (((hours * 60) + minutes) * 60 * 1000);
  }
}

export default class MatrixView extends React.Component<{
  missions: Scanned<Mission>,
  recoveries: Scanned<Recovery>,
  shipbuildings: Scanned<Shipbuilding>,
}, {
  manual: {
    label: string,
    cell: CellModel
  },
}> {

  constructor(props) {
    super(props);
    this.state = {manual: null};
  }

  getColumn<T>(label: string, cells: CellModel[], format: DisplayFormat) {
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
                className={cn("column", "col-9", "queue-time", tooltip.className)}
                data-tooltip={tooltip.data}
                onClick={() => this.openManualTimerDialog(label, cell)}
              >{cell.getDisplayTime(format)}</div>
            </div>
          );
        })}
        {this.state.manual ? this.renderModal() : null}
      </div>
    );
  }

  /**
   * マニュアル登録のモーダルダイアログ
   */
  renderModal() {
    const { label, cell } = this.state.manual;
    return (
      <div className="modal modal-sm active" id="modal-id">
        <a className="modal-overlay" onClick={this.closeManualModal.bind(this)} />
        <div className="modal-container">
          <div className="modal-header">
            {/* <a href="#close" className="btn btn-clear float-right" aria-label="Close"
              onClick={() => this.closeManualModal()}
            /> */}
            <div className="modal-title h5">{label} {cell.identityText()}</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <input type="time"
                defaultValue={cell.draft}
                onChange={ev => cell.draft = ev.target.value}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className={cn("btn", "btn-error", label)} onClick={() => this.onManualTimerDelete(cell)}>削除</button>
            <button className={cn("btn", "btn-primary", label)} onClick={() => this.onManualTimerCommit(cell)}>登録</button>
            <button className={cn("btn", "btn-cancel", label)} onClick={() => this.closeManualModal()}>キャンセル</button>
          </div>
        </div>
      </div>
    );
  }

  onManualTimerDelete(cell: CellModel) {
    cell.delete();
    this.closeManualModal();
  }
  onManualTimerCommit(cell: CellModel) {
    cell.commit();
    this.closeManualModal();
  }
  openManualTimerDialog(label: string, cell: CellModel) {
    this.setState({ manual: { label, cell } });
  }
  closeManualModal() {
    this.setState({ manual: null });
  }

  populateCells(kind: Kind, scanned: Scanned<Mission | Recovery | Shipbuilding>): CellModel[] {
    const cells: CellModel[] = [];
    const queues = scanned.upcomming;
    const maxlen = 4; // FIXME: 今後これ変わらんかね？
    for (let i = 1; i <= maxlen; i++) {
      const queue = queues.find(q => q.registeredOn(i));
      cells.push(new CellModel(kind, i, queue));
    }
    return cells;
  }

  render() {
    const { missions, recoveries, shipbuildings } = this.props;
    const format = TimerDisplaySetting.user().format;
    return (
      <div className="queue-matrix container">
        <div className="columns">
          {this.getColumn("遠征", this.populateCells(Kind.Mission, missions), format)}
          {this.getColumn("修復", this.populateCells(Kind.Recovery, recoveries), format)}
          {this.getColumn("建造", this.populateCells(Kind.Shipbuilding, shipbuildings), format)}
        </div>
      </div>
    );
  }
}