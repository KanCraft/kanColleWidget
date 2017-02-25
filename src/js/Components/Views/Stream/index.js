import React, {Component,PropTypes} from "react";

import IconButton from "material-ui/IconButton";
import FiberManualRecord from "material-ui/svg-icons/av/fiber-manual-record";
import Stop from "material-ui/svg-icons/av/stop";
import {red500,grey500} from "material-ui/styles/colors";

import {Client} from "chomex";

class VideoPlayer extends Component {
    render() {
        return (
          <video style={{width: "100%"}} src={this.props.src} autoPlay="true"/>
        );
    }
    static propTypes = {
        src: PropTypes.string
    }
}

class VideoController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            started:   0,
        };
    }
    getActionButton() {
        if (this.state.recording) {
            return (
              <IconButton iconStyle={{color:grey500}} onClick={this.stopRecording.bind(this)}>
                <Stop />
              </IconButton>
            );
        }
        return (
          <IconButton iconStyle={{color:red500}} onClick={this.startRecording.bind(this)}>
            <FiberManualRecord />
          </IconButton>
        );
    }
    startRecording() {
        this.setState({recording: true, started: Date.now()});
        this.props.client.message("/stream/recording/start");
    }
    stopRecording() {
        this.setState({recording: false});
        this.props.client.message("/stream/recording/stop").then(({data}) => {
            if (!data.url) return; // FIXME: とりあえず
            const ext = data.type.match("mp4") ? "" : data.type.split("/").pop();
            let a = document.createElement("a");
            a.href = data.url;
            a.download = `video_${Date.now()}.${ext}`;
            a.click();
            window.URL.revokeObjectURL(data.url);
        });
    }
    render() {
        return (
          <div style={{marginLeft: "12px"}}>
            {this.getActionButton()}
          </div>
        );
    }
    static propTypes = {
        client: PropTypes.object.isRequired,
    }
}

export default class StreamView extends Component {
    constructor(props) {
        super(props);
        this.client = new Client(chrome.runtime);
        window.onbeforeunload = () => {
            this.client.message("/stream/revoke");
            return;
        };
    }
    render() {
        let url = new URL(location.href);
        return (
          <div style={{margin:"0 auto", width:"80%"}}>
            <div style={{display:"flex"}}>
              <div style={{flex:"2"}}>
                <VideoPlayer src={url.searchParams.get("src")} />
              </div>
              <div style={{flex:"1"}}>
              </div>
            </div>
            <div>
              <VideoController
                client={this.client}
              />
            </div>
          </div>
        );
    }
}
