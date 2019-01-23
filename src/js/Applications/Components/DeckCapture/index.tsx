import React, { Component } from "react";

import DeckCapture from "../../Models/DeckCapture";
import SideBar from "./SideBar";
import SettingModal from "./SettingModal";
import Composer from "./Composer";

// FIXME: このstateの構造、汚すぎでは？
export default class DeckCaptureView extends Component<{}, {
  selected: string;        // 今どのせっていが選択されているか
  setting:  DeckCapture;   // 選択されている設定 FIXME: 冗長では？
  settings: DeckCapture[]; // 選択可能なせってい一覧
  row, col, page: number;
  preview: string;
  open: boolean;
}> {
  constructor(props) {
    super(props);
    const initial = "normal";
    const setting: DeckCapture = DeckCapture.find(initial);
    this.state = {
      selected: initial,
      setting,
      settings: DeckCapture.list(),
      row: setting.row,
      col: setting.col,
      page: setting.page,
      preview: null,
      open: false,
    }
  }
  render() {
    const {
      setting,
      settings,
      selected,
      preview,
      row, col, page,
      open,
    } = this.state;
    return (
      <div className="container root">
        <div className="columns root">
          <div className="column col-3">
            <SideBar
              settings={settings}
              onSelect={ev => this.onSettingChange(ev)}
              selected={selected}
              preview={preview}
              row={row}
              col={col}
              page={page}
            />
            <SettingModal active={open} />
          </div>
          <div className="column col-9">
            <Composer setting={setting} />
          </div>
        </div>
      </div>
    );
  }
  private onSettingChange(ev) {
    const selected = ev.target.value;
    const setting = DeckCapture.find<DeckCapture>(selected);
    this.setState({
      selected,
      setting,
      row:  setting.row,
      col:  setting.col,
      page: setting.page,
    });
  }
}

//   public created() {
//     this.client.message("/capture/screenshot", {open: false}).then(res => {
//       this.preview = res.uri;
//       this.$forceUpdate();
//     }).catch(err => {
//       if (err.status == 404) {
//         alert("ゲーム画面を開いてからリロードしてください");
//       } else {
//         alert(err.status);
//       }
//     });
//   }
