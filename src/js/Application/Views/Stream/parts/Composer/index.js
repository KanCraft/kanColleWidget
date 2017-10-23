import React, {Component} from "react";
import PropTypes from "prop-types";

import FlatButton   from "material-ui/FlatButton";
import FileDownload from "material-ui/svg-icons/file/file-download";
import Forward      from "material-ui/svg-icons/content/forward";

import ComposePanel from "./ComposePanel";

import KCWidgetAPI from "../../../../../Services/API/KCW";
import Config      from "../../../../Models/Config";

export default class VideoComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revokeURLs: [this.props.src],
      mp4: {
        blob:    null,
        loading: false,
      },
      output: "",
      speed: 1.0,
      duration: 0,
      start: 0,
      end:  0,
    };
    // FIXME: うーん、ここでwindow.onbeforeunload使っちゃうと、他のコンポーネントで使えなくなるよなあ
    window.onbeforeunload = () => {
      this.state.revokeURLs.map(url => window.URL.revokeObjectURL(url));
      return;
    };
  }
  componentDidMount() {
    this.video.addEventListener("loadedmetadata", () => {
      const id = setInterval(() => {
        if (this.video.readyState < 4) return;
        if (this.video.duration == Infinity) return;
        clearInterval(id);
        this.setState({duration: this.video.duration, end: this.video.duration});
      }, 100);
    });
    this.video.addEventListener("play", () => {
      // 開始位置が指定されている場合は、playボタン押下時に開始位置に移動する
      // FIXME: でもこれだと、途中で一時停止して再開するときもそうなったゆんだよなあ
      if (this.state.start != 0) {
        this.video.currentTime = this.state.start;
      }
    });
    this.video.addEventListener("timeupdate", ev => {
      console.log(ev.target.currentTime);
      if (this.state.end == 0) return;
      if (this.state.end == this.duration) return;
      if (this.state.end < ev.target.currentTime) this.video.pause();
    });
  }
  componentWillReceiveProps(next) {
    if (this.props.src != next.src) {
      this.setState({mp4:{blob:null,loading:false},output:""});
    }
  }
  onClickSaveWebm() {
    const ext = "webm";
    let a = document.createElement("a");
    a.href = this.props.src;
    a.download = `video_${Date.now()}.${ext}`;
    a.click();
    // window.URL.revokeObjectURL(this.props.src);
  }
  onClickConvertToMP4() {
    this.setState({mp4:{blob:null,loading:true}});
    const api = new KCWidgetAPI(Config.find("api-server-url").value);
    fetch(this.props.src).then(res => res.blob()).then(blob => {
      let body = new FormData();
      body.append("file", blob);
      body.append("start",    this.state.start + "s");
      body.append("duration", (this.state.end - this.state.start)/parseFloat(this.state.speed) + "s");
      body.append("speed",    this.state.speed);
      return api.convertWEBM({body}).progress(ev => {
        if (ev.target.status) this.setState({output: `Downloading... ${Math.floor(ev.loaded*1000/(ev.total || 1))/10}%`});
        else if (ev.loaded/ev.total == 1) this.setState({output: "Processing...."});
        else this.setState({output: `Uploading... ${Math.floor(ev.loaded*1000/(ev.total || 1))/10}%`});
      });
    }).then(blob => {
      this.setState({mp4:{blob, loading:false},output:""});
    }).catch(err => {
      console.log("ERROR", err);
      this.setState({mp4:{loading:false},output:err});
    });
  }
  render() {
    const styles = {
      container: {
        padding: "24px",
      },
      videoRow: {
        display:      "flex",
        height:      "240px",
        marginBottom: "24px",
      },
    };
    return (
      <div style={styles.container}>
        <div style={styles.videoRow}>
          <div style={{flex: 3}}>
            <video
              src={this.props.src}
              autoPlay={true}
              controls={true}
              style={{height:"100%",width:"100%"}}
              ref={video => this.video = video}
            />
          </div>
        </div>
        <ComposePanel
          speed={this.state.speed}
          duration={this.state.duration}
          changeSpeed={this.changeSpeed.bind(this)}
          changeDuration={this.changeDuration.bind(this)}
        />
        <div style={{display:"flex", width: "100%", pisition:"absolute", bottom:0}}>
          <div style={{flex: 1}}>
            <FlatButton
              label="webm"
              icon={<FileDownload />}
              onClick={this.onClickSaveWebm.bind(this)}
              primary={true}
              fullWidth={true}
              style={{width: "100%"}}
            />
          </div>
          {this.renderMP4Buttons()}
          <div style={{flex: 1}}>
            <FlatButton
              label="gif"
              icon={<Forward />}
              primary={true}
              onClick={() => alert("開発者のTODO: GifEncoder叩くけど時間かかるのでそれっぽいUI考える")}
              fullWidth={true}
              style={{width: "100%"}}
            />
          </div>
        </div>
        <pre>
          <span style={{color:"#b0baca"}}>{this.state.output}</span>
        </pre>
      </div>
    );
  }
  changeSpeed(speed) {
    this.video.playbackRate = speed;
    this.setState({speed: speed});
  }
  changeDuration(start, end) {
    if (this.state.start != start) {
      this.video.currentTime = start;
    } else if (this.state.end != end) {
      this.video.currentTime = end;
    }
    this.setState({start, end});
  }
  onClickSaveMP4() {
    let url = window.URL.createObjectURL(this.state.mp4.blob);
    this.setState({revokeURLs:[].concat(this.state.revokeURLs, url)});
    let a = document.createElement("a");
    a.download = `video_${Date.now()}`;
    a.href = url;
    a.click();
  }
  renderMP4Buttons() {
    if (this.state.mp4.blob == null) {
      return (
        <div style={{flex: 1}}>
          <FlatButton
          label="mp4"
          icon={<Forward />}
          primary={true}
          onClick={this.onClickConvertToMP4.bind(this)}
          fullWidth={true}
          style={{width: "100%"}}
          disabled={this.state.mp4.loading}
        />
        </div>
      );
    }
    return (
      <div style={{flex: 1}}>
        <FlatButton
          label="mp4"
          icon={<FileDownload />}
          primary={true}
          onClick={this.onClickSaveMP4.bind(this)}
          fullWidth={true}
          style={{width: "100%"}}
        />
        <FlatButton
          label="mp4"
          icon={<img src="/dest/img/icons/twitter-primary.svg" style={{height:"18px"}} />}
          primary={true}
          onClick={() => alert("TODO: 連携でツイートするやつ")}
          fullWidth={true}
          style={{width: "100%"}}
        />
      </div>
    );
  }
  static propTypes = {
    src: PropTypes.string.isRequired,
  }
}
