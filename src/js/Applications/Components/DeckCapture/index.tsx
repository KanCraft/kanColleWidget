import React, { Component } from "react";
import chomex, { Client } from "chomex";

import DeckCapture, { DeckCaptureLike } from "../../Models/DeckCapture";
import SideBar from "./SideBar";
import SettingModal from "./SettingModal";
import Composer from "./Composer";
import { RectParam } from "../../../Services/Rectangle";
import ComposeImageService from "../../../Services/ComposeImage";
import TempStorage from "../../../Services/TempStorage";
import WindowService from "../../../Services/Window";

// FIXME: このstateの構造、汚すぎでは？
// eslint-disable-next-line @typescript-eslint/ban-types
export default class DeckCaptureView extends Component<{}, {
  selected:  DeckCaptureLike;  // 現在選択されている設定
  settings: DeckCaptureLike[]; // 選択可能なせってい一覧
  row; col; page: number;
  preview: string;
  stack: (string | null)[]; // すでに撮影された画像断片
  modified: boolean; // フォームを使って設定がカスタマイズされたかどうか
  open: boolean; // カスタマイズされた設定を保存するとかしないとかのモーダル
}> {

  private client: chomex.Client = new Client(chrome.runtime);

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(props: Readonly<{}>) {
    super(props);
    const setting: DeckCaptureLike = DeckCapture.find<DeckCapture>("normal").obj();
    this.state = {
      selected: setting,
      settings: DeckCapture.listObj(),
      row: setting.row,
      col: setting.col,
      page: setting.page,
      preview: null,
      open: false,
      stack: [],
      modified: false,
    };
  }

  async componentDidMount(): Promise<void> {
    // サイドバーにpreviewを表示したい
    const { uri } = await this.client.message("/capture/screenshot", { open: false });
    this.setState({ preview: uri });
  }

  render(): JSX.Element {
    const {
      settings,
      selected,
      preview,
      row, col, page,
      stack,
      open,
      modified,
    } = this.state;
    return (
      <div className="container root">
        <div className="columns root">
          <div className="column col-3">
            <SideBar
              settings={settings}
              selected={selected}
              onSelect={ev => this.onSettingChange(ev)}
              onModify={(k, v) => this.onSettingAttrChange(k, v)}
              preview={preview}
              row={row}
              col={col}
              page={page}
              modified={modified}
              openModal={() => this.setState({ open: true })}
              deleteSetting={(_id) => {
                const setting = DeckCapture.find<DeckCapture>(_id);
                if (window.confirm(`「${setting.title}」を削除します`)) {
                  setting.delete();
                  window.location.reload();
                }
              }}
            />
            {open ? <SettingModal active={open} setting={selected} close={(created: number|string) => {
              created ? this.setState({ settings: DeckCapture.listObj(), selected: DeckCapture.find<DeckCapture>(created), open: false }) : this.setState({ open: false });
            }} /> : null}
          </div>
          <div className="column col-9">
            <Composer
              setting={selected}
              stack={stack}
              push={(blank = false) => this.pushCapture(blank)}
              pop={() => this.popCapture()}
              compose={() => this.composeDeckCapture()}
            />
          </div>
        </div>
      </div>
    );
  }
  private onSettingChange(ev) {
    const selected = DeckCapture.find<DeckCapture>(ev.target.value);
    this.setState({
      modified: false,
      selected,
      row:  selected.row,
      col:  selected.col,
      page: selected.page,
    });
  }

  private onSettingAttrChange(key: string, value: number) {
    this.setState({ modified: true });
    const selected = this.state.selected;
    switch (key) {
    case "row":
      selected[key] = value;
      return this.setState({ row: value, selected });
    case "col":
      selected[key] = value;
      return this.setState({ col: value, selected });
    case "page":
      selected[key] = value;
      return this.setState({ page: value, selected });
    case "cell.x":
      selected.cell.x = value;
      return this.setState({ selected });
    case "cell.y":
      selected.cell.y = value;
      return this.setState({ selected });
    case "cell.w":
      selected.cell.w = value;
      return this.setState({ selected });
    case "cell.h":
      selected.cell.h = value;
      return this.setState({ selected });
    }
  }

  private async pushCapture(blank = false) {
    if (blank) return this.setState({ stack: this.state.stack.concat(null) });
    const rect: RectParam = this.state.selected.cell;
    const { uri } = await this.client.message("/capture/screenshot", { open: false, rect });
    this.setState({ stack: this.state.stack.concat(uri) });
  }

  private popCapture() {
    const stack = this.state.stack.concat();
    stack.pop();
    this.setState({ stack });
  }

  private async composeDeckCapture() {
    const { stack, selected: deckcapture } = this.state;
    const service = ComposeImageService.withStrategyFor(deckcapture);
    const composed = await service.compose(stack);
    const key = await TempStorage.new().store(`deckcapture_${Date.now()}`, composed);
    WindowService.getInstance().openCapturePage({ key });
  }
}
