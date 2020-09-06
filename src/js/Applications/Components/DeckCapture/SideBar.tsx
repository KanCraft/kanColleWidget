import React, { Component } from "react";
import DeckCapture from "../../Models/DeckCapture";

/**
 * 編成キャプチャの設定などを操作する左のやつ
 */
export default class SideBar extends Component<{
  onSelect: (DeckCapture) => any;
  onModify: (k: string, v: number) => void;
  settings: DeckCapture[];
  selected: DeckCapture;
  preview: string;
  row; col; page: number;
}> {
  render(): JSX.Element {
    const { settings, selected, preview, row, col, page } = this.props;
    return (
      <div className="container sidebar">
        <div className="form-group">
          <select
            className="form-select"
            onChange={this.props.onSelect}
            value={selected._id}
          >
            {settings.map(s => <option key={s._id} value={s._id} >{s.title}</option>)}
          </select>
        </div>

        <div className="preview-container">
          <div id="preview">
            <img src={preview} style={{width: "100%", display: "block"}} />
            {(preview && selected) ? <div id="preview-mesh" style={this.getMeshStyle(selected)}></div> : null}
          </div>
        </div>

        <div className="input-group">
          <input type="number" min="1" className="form-input" value={row} onChange={ev => this.props.onModify("row", parseInt(ev.target.value))} />
          <span className="input-group-addon">行</span>
        </div>

        <div className="input-group">
          <input type="number" min="1" className="form-input" value={col} onChange={ev => this.props.onModify("col", parseInt(ev.target.value))} />
          <span className="input-group-addon">列</span>
        </div>

        <div className="input-group">
          <input type="number" min="1" className="form-input" value={page} onChange={ev => this.props.onModify("page", parseInt(ev.target.value))} />
          <span className="input-group-addon">ページ</span>
        </div>

      </div>
    );
  }

  private getMeshStyle(setting: DeckCapture): { [key: string]: string } {
    const { cell: { x, y, w, h } } = setting;
    return {
      left: `${Math.floor(x * 100)}%`,
      top: `${Math.floor(y * 100)}%`,
      width: `${Math.floor(w * 100)}%`,
      height: `${Math.floor(h * 100)}%`,
    };
  }
}
