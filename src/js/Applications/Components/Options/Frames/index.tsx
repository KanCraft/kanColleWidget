import React from "react";
import Frame from "../../../Models/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencilAlt, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import SectionTitle from "../SectionTitle";

class FrameEditorView extends React.Component<{
  frame: Frame | null;
  done: () => void;
}, {
  editMode: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = { editMode: false };
  }
  render() {
    const frame = this.props.frame || Frame.new({ size: { width: 800, height: 640 }, position: { left: 0, top: 0 } });
    const isAddMode = this.props.frame == null;
    const editMode = isAddMode || this.state.editMode;
    return (
      <div className="columns">
        <div className="column col-2">
          {isAddMode ? <div className="add-frame">
            <div className="frame-title">
              <input type="text" placeholder="設定の名前" onChange={ev => frame.alias = ev.target.value} />
            </div>
            <small className="frame-description text-gray">
              <input type="text" placeholder="設定の説明" onChange={ev => frame.description = ev.target.value} />
            </small>
          </div>: <div>
            <div className="frame-title">{frame.alias}</div>
            <small className="frame-description text-gray">{frame.description}</small>
          </div>}
        </div>
        <div className="column">
          <div className="columns">
            <div className="column col-3"><label className="form-label label-sm text-right">幅</label></div>
            <div className="column col-3">
              <input
                disabled={!editMode}
                className="form-input input-sm" type="number" min="90" defaultValue={frame.size.width}
                onChange={(ev) => frame.size.width = parseInt(ev.target.value)}
              />
            </div>
            <div className="column col-3"><label className="form-label label-sm text-right">高さ</label></div>
            <div className="column col-3">
              <input
                disabled={!editMode}
                className="form-input input-sm" type="number" min="54" defaultValue={frame.size.height}
              />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="columns">
            <div className="column col-3"><label className="form-label label-sm text-right">横位置</label></div>
            <div className="column col-3">
              <input
                disabled={!editMode}
                className="form-input input-sm" type="number" min="0" defaultValue={frame.position.left}
              />
            </div>
            <div className="column col-3"><label className="form-label label-sm text-right">縦位置</label></div>
            <div className="column col-3">
              <input
                disabled={!editMode}
                className="form-input input-sm" type="number" min="0" defaultValue={frame.position.top}
              />
            </div>
          </div>
        </div>
        <div className="column col-2">
          {editMode ? [
            <button key={0} className="btn btn-sm btn-primary float-right" title="保存" onClick={() => this.onClickCommit(frame)}><FontAwesomeIcon icon={faCheck} /></button>,
            <button key={1} className="btn btn-sm btn-error float-right" title="削除" onClick={() => this.onClickDelete(frame)}><FontAwesomeIcon icon={faTrashAlt} /></button>
          ] : <button className="btn btn-sm btn-link float-right" title="編集" onClick={() => this.setState({ editMode: true })}><FontAwesomeIcon icon={faPencilAlt} /></button>}
        </div>
      </div>
    );
  }
  private onClickCommit(frame: Frame) {
    frame.save();
    this.setState({ editMode: false });
    this.props.done();
  }
  private onClickDelete(f: Frame) {
    if (!f._id) return this.props.done();
    const ok = window.confirm(`以下の窓設定を削除してもいいですか？\n\nID: ${f._id}\n名前: ${f.alias}\n説明: ${f.description}\n`);
    if (!ok) return;
    f.delete();
    this.props.done();
  }
}

export default class FrameSettingView extends React.Component<{}, {
  addMode: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = { addMode: false };
  }
  render() {
    const { addMode } = this.state;
    const frames = Frame.filter<Frame>(f => f._id != "user");
    const ts = Date.now();
    return (
      <section className="category frame-setting">
        <SectionTitle models={[Frame]}>ゲーム窓サイズ設定</SectionTitle>
        <blockquote className="description text-gray">MEMORYっていうのは「前回起動してた状態」っていう意味です。</blockquote>
        <div className="container">
          {frames.map(frame => <FrameEditorView key={`${frame._id}?ts=${ts}`} frame={frame} done={() => this.refresh()} />)}
          {addMode ? <FrameEditorView key={"new"} frame={null} done={() => this.refresh()}
          />: <div className="columns add-btn-wrapper">
            <div className="column"></div>
            <div className="column col-auto">
              <button className="btn btn-sm add-btn">
                <FontAwesomeIcon icon={faPlus} onClick={() => this.setState({ addMode: true })} />
              </button>
            </div>
          </div>}
        </div>
      </section>
    );
  }

  refresh() {
    this.setState({ addMode: false });
    this.forceUpdate();
  }

}