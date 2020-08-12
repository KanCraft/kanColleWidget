import React, { Component, createRef, RefObject } from "react";
import cn from "classnames";

import TempStorage from "../../../Services/TempStorage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faSquareFull,
  faPen, faEraser,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ScreenshotSetting from "../../Models/Settings/ScreenshotSetting";
import DrawToolBase, { ToolParams } from "./Tools/DrawToolBase";
import Rect from "./Tools/Rect";

export default class CapturePage extends Component<{}, {
  uri: string,
  info: string,
  tool?: typeof DrawToolBase, // コンストラクタのみstateとして持つ
  color: string,
}> {
  private canvas: RefObject<HTMLCanvasElement>;
  // {{{ Drawer Tools 系
  private isMouseDown: boolean;
  private drawtool: DrawToolBase; // インスタンスを持つ
  // }}}
  // {{{ 過去の状態を保存する. 現在の状態はHistoryには含まれない
  private history: ImageData[] = [];
  // }}}
  constructor(props) {
    super(props);
    const search = new URLSearchParams(location.search);
    this.state = {
      uri: null,
      info: search.get("info"),
      tool: null,
      color: "#01d0d0",
    };
    this.canvas = createRef<HTMLCanvasElement>();
  }
  async componentDidMount() {
    /**
     * 当初は、capture.htmlで chrome.runtime.onMessage を listen しようとしたが、
     * Chrome拡張ドメイン（chrome-extension://{ext_id}）において複数 runtime.onMessage
     * を listen すると、あとから addListener された リスナーが有効になるため、
     * content_script からの sendMessage が not found になるケースが増える。
     * したがって、capture.html において image uri を取得するのは、runtime.onMessage以外の
     * 方法であるべきである。
     */
    // const router = new Router();
    // router.on("/capture/show", (message) => this.showImage(message.uri));
    // chrome.runtime.onMessage.addListener(router.listener());
    const search = new URLSearchParams(location.search);
    const key = search.get("key");
    const url = search.get("url");
    if (key) {
      const uri = await TempStorage.new().draw(key);
      this.drawImageURI(uri);
    } else if (url) {
      this.drawImageURI(url);
    }
  }
  async drawImageURI(uri: string) {
    const img = new Image();
    await img.load(uri);
    this.canvas.current.width = img.width;
    this.canvas.current.height = img.height;
    this.canvas.current.getContext("2d").drawImage(img, 0, 0);
  }
  async onClickDownloadButton() {
    const search = new URLSearchParams(location.search);
    const filename = search.get("filename");
    const setting = ScreenshotSetting.user();
    chrome.downloads.download({
      url: this.canvas.current.toDataURL(`image/${setting.format}`),
      filename: setting.getFullDownloadPath(filename),
    });
  }
  render() {
    return (
      <div className="pane-container">
        <div className="container main-pane">
          <div className="columns">
            <div className="column col-auto tools-pane">
              <div className="card">
                <div className="card-body">
                  <div>
                    <input
                      type="color"
                      defaultValue="#01d0d0"
                      onChange={ev => {
                        this.setState({ color: ev.target.value });
                      }}
                    />
                  </div>
                  <div className="divider"></div>
                  <div>
                    <FontAwesomeIcon className="c-hand" icon={faPen} onClick={() => alert("未実装です")} />
                  </div>
                  <div className={cn("tooltip tooltip-right", { "selected": this.state.tool == Rect })} data-tooltip="矩形">
                    <FontAwesomeIcon className="c-hand"
                      icon={faSquareFull}
                      onClick={() => this.setState({ tool: Rect })}
                    />
                  </div>
                  <div>
                    <FontAwesomeIcon className="c-hand" icon={faEraser} onClick={() => alert("未実装です")} />
                  </div>
                  <div className="divider"></div>
                  <div className="tooltip tooltip-right" data-tooltip="ひとつ戻す">
                    <FontAwesomeIcon className="c-hand"
                      icon={faUndoAlt}
                      onClick={() => this.undo()}
                    />
                  </div>
                  <div className="divider"></div>
                  <div>
                    <FontAwesomeIcon
                      className="c-hand" icon={faTwitter as IconProp}
                      onClick={() => alert("未実装です")}
                    />
                  </div>
                  <div className="divider"></div>
                  <div className="tooltip tooltip-right" data-tooltip="保存">
                    <FontAwesomeIcon
                      className="c-hand" icon={faDownload}
                      onClick={() => this.onClickDownloadButton()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="column canvas-pane">
              <canvas
                ref={this.canvas}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseMove={this.onMouseMove.bind(this)}
                onMouseUp={this.onMouseUp.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="container bottom-pane">
          {this.state.info ? <pre className="code" data-lang="DEBUG">
            <code>{this.state.info}</code>
          </pre> : null}
        </div>
      </div>
    );
  }
  private getCurrentParams(): ToolParams {
    return {
      color: this.state.color,
      fill: true,
    };
  }
  private onMouseDown(ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!this.state.tool) return;
    this.isMouseDown = true;
    this.drawtool = new this.state.tool(this.canvas.current, this.getCurrentParams());
    // なにかやり始める前にかならずHistoryを取る
    this.pushHistory();
    this.drawtool.onStart(ev);
  }
  private onMouseMove(ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!this.drawtool) return;
    if (!this.isMouseDown) return;
    this.drawtool.onMove(ev);
  }
  private onMouseUp(ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!this.drawtool) return;
    if (!this.isMouseDown) return;
    this.isMouseDown = false;
    this.drawtool.onEnd(ev);
    this.drawtool = null;
  }

  private undo() {
    const memory = this.history.pop();
    if (!memory) return; // なにもしない
    this.canvas.current.getContext("2d").putImageData(memory, 0, 0);
  }
  private pushHistory() {
    this.history.push(
      this.canvas.current.getContext("2d").getImageData(
        0, 0,
        this.canvas.current.width, this.canvas.current.height
      )
    );
  }
}
