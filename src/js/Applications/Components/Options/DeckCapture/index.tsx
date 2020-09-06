import React from "react";
import DeckCapture from "../../../Models/DeckCapture";
import SectionTitle from "../SectionTitle";
import { faTrashAlt, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DeckCaptureItemView extends React.Component<{
  deckcapture: DeckCapture;
  done: () => void;
}> {
  render() {
    const { deckcapture: d } = this.props;
    return (
      <div className="columns">
        <div className="column col-2">
          <div>
            <div className="dc-title">{d.title}</div>
          </div>
        </div>
        <div className="column">
          <div className="columns">
            <div className="column"><label className="form-label label-sm text-right">X</label></div>
            <div className="column"><span>{d.cell.x}</span></div>
            <div className="column"><label className="form-label label-sm text-right">Y</label></div>
            <div className="column"><span>{d.cell.y}</span></div>
          </div>
        </div>
        <div className="column">
          <div className="columns">
            <div className="column"><label className="form-label label-sm text-right">W</label></div>
            <div className="column"><span>{d.cell.w}</span></div>
            <div className="column"><label className="form-label label-sm text-right">H</label></div>
            <div className="column"><span>{d.cell.h}</span></div>
          </div>
        </div>
        <div className="column">
          <div className="columns">
            <div className="column"><label className="form-label label-sm text-right">R</label></div>
            <div className="column"><span>{d.row}</span></div>
            <div className="column"><label className="form-label label-sm text-right">C</label></div>
            <div className="column"><span>{d.col}</span></div>
            <div className="column"><label className="form-label label-sm text-right">P</label></div>
            <div className="column"><span>{d.page}</span></div>
          </div>
        </div>
        <div className="column col-2">
          <button
            disabled={d.protected}
            className="btn btn-sm btn-link float-right"
            title="削除"
            onClick={() => this.onClickDelete(d)}>
            <FontAwesomeIcon icon={d.protected ? faLock : faTrashAlt} />
          </button>
        </div>
      </div>
    );
  }
  private onClickDelete(d: DeckCapture) {
    if (!d._id) return this.props.done();
    const ok = window.confirm(`「${d.title}」を削除しますか？\n`);
    if (!ok) return;
    d.delete();
    this.props.done();
  }
}

export default class DeckCaptureSettingView extends React.Component {
  render() {
    const deckcaptures: DeckCapture[] = DeckCapture.list();
    const ts = Date.now();
    return (
      <section className="category frame-setting">
        <SectionTitle models={[DeckCapture]}>編成キャプチャ設定</SectionTitle>
        <blockquote className="description text-gray">追加は編成キャプチャの画面からできます。</blockquote>
        <div className="container">
          {deckcaptures.map(d => <DeckCaptureItemView key={`${d._id}?ts=${ts}`} deckcapture={d} done={() => this.refresh()} />)}
        </div>
      </section>
    );
  }
  refresh() {
    this.forceUpdate();
  }
}