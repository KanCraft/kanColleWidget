import React, { Component } from "react";
import chomex, { Client } from "chomex";
import cn from "classnames";

import DeckCapture from "../../Models/DeckCapture";
import SideBar from "./SideBar";
import SettingModal from "./SettingModal";
import Composer from "./Composer";
import { RectParam } from "../../../Services/Rectangle";
import ComposeImageService from "../../../Services/ComposeImage";

// FIXME: このstateの構造、汚すぎでは？
// eslint-disable-next-line @typescript-eslint/ban-types
export default class DeckCaptureView extends Component<{}, {
  selected:  DeckCapture;  // 現在選択されている設定
  settings: DeckCapture[]; // 選択可能なせってい一覧
  row; col; page: number;
  preview: string;
  open: boolean;
  stack: string[]; // すでに撮影された画像断片
  composed?: string; // 生成された編成キャプチャ
}> {

  private client: chomex.Client = new Client(chrome.runtime);

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(props: Readonly<{}>) {
    super(props);
    const setting: DeckCapture = DeckCapture.find("normal");
    this.state = {
      selected: setting,
      settings: DeckCapture.list(),
      row: setting.row,
      col: setting.col,
      page: setting.page,
      preview: null,
      open: false,
      stack: [],
      composed: null,
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
      open,
      stack,
    } = this.state;
    return (
      <div className="container root">
        <div className="columns root">
          <div className="column col-3">
            <SideBar
              settings={settings}
              selected={selected}
              onSelect={ev => this.onSettingChange(ev)}
              preview={preview}
              row={row}
              col={col}
              page={page}
            />
            <SettingModal active={open} />
          </div>
          <div className="column col-9">
            <Composer
              setting={selected}
              stack={stack}
              push={() => this.pushCapture()}
              compose={() => this.composeDeckCapture()}
            />
          </div>

          {this.getModal()}

        </div>


      </div>
    );
  }
  private onSettingChange(ev) {
    const selected = DeckCapture.find<DeckCapture>(ev.target.value);
    this.setState({
      selected,
      row:  selected.row,
      col:  selected.col,
      page: selected.page,
    });
  }
  private async pushCapture() {
    const rect: RectParam = this.state.selected.cell;
    const { uri } = await this.client.message("/capture/screenshot", { open: false, rect });
    this.setState({
      stack: this.state.stack.concat(uri),
    });
  }

  private async composeDeckCapture() {
    const { stack, selected: deckcapture } = this.state;
    const service = ComposeImageService.withStrategyFor(deckcapture);
    const composed = await service.compose(stack);
    this.setState({ composed });
  }

  private discardComposed() {
    this.setState({ composed: null });
  }

  private getModal() {
    const { composed, selected } = this.state;
    return (
      <div className={cn("modal", composed ? "active" : "")} id="modal-id">
        <a href="#close" className="modal-overlay" aria-label="Close" onClick={() => this.discardComposed()}></a>
        <div className="modal-container">
          <div className="modal-header">
            <div className="modal-title h5">{selected.title}</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <img className="composed-img" src={composed} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" disabled>保存（未実装）</button>
            <button className="btn btn-primary" disabled>ツイート（未実装）</button>
            <button className="btn btn-link" onClick={() => this.discardComposed()}>破棄</button>
          </div>
        </div>
      </div>
    );
  }
}
