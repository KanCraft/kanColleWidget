import React, { Component } from "react";
import DeckCapture from "../../Models/DeckCapture";


export default class SideBar extends Component<{
  onSelect: (DeckCapture) => any;
  settings: DeckCapture[];
  selected: string;
  preview: string;
  row; col; page: number;
}> {
  render() {
    const {settings, selected, preview, row, col, page} = this.props;
    return (
      <div className="container sidebar">
        <div className="form-group">
          <select
            className="form-select"
            onChange={this.props.onSelect}
            value={selected}
          >
            {settings.map(s => <option key={s._id} value={s._id} >{s.title}</option>)}
          </select>
        </div>

        <div className="preview-container">
          <div id="preview">
            <img src={preview} style={{width: "100%", display: "block"}} />
          </div>
        </div>

        <div className="input-group">
          <input type="number" className="form-input" value={row} onChange={() => console.log("TODO: 親に伝える")} />
          <span className="input-group-addon">行</span>
        </div>

        <div className="input-group">
          <input type="number" className="form-input" value={col} onChange={() => console.log("TODO: 親に伝える")} />
          <span className="input-group-addon">列</span>
        </div>

        <div className="input-group">
          <input type="number" className="form-input" value={page} onChange={() => console.log("TODO: 親に伝える")} />
          <span className="input-group-addon">ページ</span>
        </div>

      </div>
    );
  }
}
