import React, { Component, createRef, RefObject } from "react";
import TempStorage from "../../../Services/TempStorage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPen, faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ScreenshotSetting from "../../Models/Settings/ScreenshotSetting";

export default class CapturePage extends Component<{}, {
  uri: string,
}> {
  private canvas: RefObject<HTMLCanvasElement>;
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
    };
    this.canvas = createRef<HTMLCanvasElement>();
  }
  componentDidMount() {
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
    const temp = new TempStorage();
    const uri = temp.draw(key);
    // this.setState({ uri });
    this.drawImageURI(uri);
  }
  async drawImageURI(uri: string) {
    const img = new Image();
    await img.load(uri);
    this.canvas.current.width = img.width;
    this.canvas.current.height = img.height;
    this.canvas.current.getContext("2d").drawImage(img, 0, 0);
  }
  async onClickDownloadButton() {
    const setting = ScreenshotSetting.user();
    chrome.downloads.download({
      url: this.canvas.current.toDataURL(`image/${setting.format}`),
      filename: setting.getFullDownloadPath(),
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
                    />
                  </div>
                  <div className="divider"></div>
                  <div>
                    <FontAwesomeIcon className="c-hand" icon={faPen}
                      onClick={() => alert("未実装です")}
                    />
                  </div>
                  <div>
                    <FontAwesomeIcon className="c-hand" icon={faEraser}
                      onClick={() => alert("未実装です")}
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
                  <div>
                    <FontAwesomeIcon
                      className="c-hand" icon={faDownload}
                      onClick={() => this.onClickDownloadButton()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="column canvas-pane">
              <canvas ref={this.canvas} />
            </div>
          </div>
        </div>
        <div className="container bottom-pane"></div>
      </div>
    );
  }
}
