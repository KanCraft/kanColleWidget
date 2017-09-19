import React, {Component, PropTypes} from "react";

import FlatButton   from "material-ui/FlatButton";
import FileDownload from "material-ui/svg-icons/file/file-download";
import Forward      from "material-ui/svg-icons/content/forward";

import KCWidgetAPI from "../../../../Services/API/KCW";
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
    };
    // FIXME: うーん、ここでwindow.onbeforeunload使っちゃうと、他のコンポーネントで使えなくなるよなあ
    window.onbeforeunload = () => {
      this.state.revokeURLs.map(url => window.URL.revokeObjectURL(url));
      return;
    };
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
      return api.convertWEBM({body}).progress(ev => {
        // TODO: なんかする
        console.log("PROGRESS", ev);
      });
    }).then(blob => {
      this.setState({mp4:{blob, loading:false}});
    }).catch(err => {
      // TODO: ログにアウトプットする
      this.setState({mp4:{loading:false}});
      console.log("ERROR", err);
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
        <div>
          <h1>TODO: ここで長さ編集したりする</h1>
        </div>
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
      </div>
    );
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
