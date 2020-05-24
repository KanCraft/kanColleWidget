import React, { Component } from "react";
import TempStorage from "../../../Services/TempStorage";

export default class CapturePage extends Component<{}, {uri: string}> {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
    };
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
    const key = (new URLSearchParams(location.search)).get("key");
    const temp = new TempStorage();
    this.setState({uri: temp.draw(key)});
  }
  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column col-4 col-sm-6">
            <img src={this.state.uri} style={{width: "100%"}} />
          </div>
        </div>
      </div>
    );
  }
}
