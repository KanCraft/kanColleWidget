import React, {Component} from "react";

import muiThemeable from "material-ui/styles/muiThemeable";
import Drawer       from "material-ui/Drawer";

import Row               from "./parts/Row";
import VideoPlayer       from "./parts/Player";
import VideoControlPanel from "./parts/ControlPanel";
import VideoComposer     from "./parts/Composer";

import {Client} from "chomex";

@muiThemeable()
export default class StreamView extends Component {
    constructor(props) {
        super(props);
        const url = new URL(location.href);
        this.state = {
            // プレー画面のキャプチャストリームURL
            capturedBlobURL: url.searchParams.get("src"),
            // STARTからSTOPまでの動画URL
            recordedBlobURL: null,
        };
        this.client = new Client(chrome.runtime);
        /* XXX: debug
        window.onbeforeunload = () => {
            this.client.message("/stream/revoke");
            return;
        };
        */
        this.drawerWidth = 180;
    }
    startRecording() {
        this.client.message("/stream/recording/start");
    }
    stopRecording() {
        this.client.message("/stream/recording/stop").then(({data}) => {
            if (!data.url) return; // FIXME: とりあえず
            this.setState({recordedBlobURL: data.url});
            // const ext = data.type.match("mp4") ? "" : data.type.split("/").pop();
            // let a = document.createElement("a");
            // a.href = data.url;
            // a.download = `video_${Date.now()}.${ext}`;
            // a.click();
            // window.URL.revokeObjectURL(data.url);
        });
    }
    getRecordingPanel(url) {
        return (
          <Drawer open={true} width={this.drawerWidth} containerStyle={{backgroundColor:"#2b2c34"}}>
            <div style={{padding:"24px"}}>
              <div style={{marginBottom: "24px"}}>
                <VideoPlayer src={url.searchParams.get("src")} />
              </div>
              <div style={{marginBottom: "24px"}}>
                <VideoControlPanel
                  client={this.client}
                  startRecording={this.startRecording.bind(this)}
                  stopRecording={this.stopRecording.bind(this)}
                  />
              </div>
            </div>
          </Drawer>
        );
    }
    getComposerPanel() {
        if (!this.state.recordedBlobURL) return null;
        return (
          <div style={{marginLeft: `${this.drawerWidth}px`}}>
            <VideoComposer
              src={this.state.recordedBlobURL}
              />
          </div>
        );
    }
    render() {
        let url = new URL(location.href);
        return (
          <div>
            {this.getRecordingPanel(url)}
            {this.getComposerPanel()}
          </div>
        );
    }
}
