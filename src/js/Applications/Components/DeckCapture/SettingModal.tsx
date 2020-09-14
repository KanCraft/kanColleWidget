import React, { Component } from "react";
import cn from "classnames";
import DeckCapture, { DeckCaptureLike } from "../../Models/DeckCapture";

/**
 * 名前をつけて保存のやつ
 */
export default class SettingModal extends Component<{
  active: boolean;
  close: (created?: number|string) => void;
  setting: DeckCaptureLike;
}, {
  title: string;
}> {
  constructor(props) {
    super(props);
    this.state = { title: "" };
  }
  render() {
    const { active, close, setting } = this.props;
    return (
      <div className={cn("modal", {active})} id="modal-id">
        <a href="#close" className="modal-overlay" aria-label="Close" onClick={() => close()} />
        <div className="modal-container">
          <div className="modal-header">
            <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={() => close()}></a>
            <div className="modal-title h5">名前をつけて保存</div>
          </div>
          <div className="modal-body">
            <div className="content container">
              <div className="columns">
                <div className="column col-2 text-right">x</div>
                <div className="column col-1 text-left">{setting.cell.x}</div>
                <div className="column col-2 text-right">y</div>
                <div className="column col-1 text-left">{setting.cell.y}</div>
                <div className="column col-2 text-right">w</div>
                <div className="column col-1 text-left">{setting.cell.w}</div>
                <div className="column col-2 text-right">h</div>
                <div className="column col-1 text-left">{setting.cell.h}</div>
              </div>
              <div className="columns">
                <div className="column col-2 text-right">行</div>
                <div className="column col-1 text-left">{setting.row}</div>
                <div className="column col-2 text-right">列</div>
                <div className="column col-1 text-left">{setting.col}</div>
                <div className="column col-2 text-right">ページ</div>
                <div className="column col-1 text-left">{setting.page}</div>
              </div>
            </div>
            <div className="columns" style={{marginTop: "8px", marginBottom: "8px"}}>
              <div className="column form-group">
                <input className={cn("form-input", { "is-error": !this.isValid() })}
                  value={this.state.title}
                  onChange={ev => this.setState({ title: ev.target.value })}
                  type="text" placeholder="この設定の名前" required={true} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={() => close()}>キャンセル</button>
            <button className="btn btn-primary" disabled={!this.isValid()} onClick={() => this.onClickSave()}>保存</button>
          </div>
        </div>
      </div>
    );
  }
  private isValid(): boolean {
    return !!this.state.title;
  }
  private onClickSave() {
    const { title } = this.state;
    const { row, col, cell } = this.props.setting;
    const created = DeckCapture.create({ title, row, col, cell, protected: false });
    this.props.close(created._id);
  }
}
