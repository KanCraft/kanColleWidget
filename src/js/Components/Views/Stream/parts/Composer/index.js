import React, {Component, PropTypes} from "react";

import FlatButton from "material-ui/FlatButton";
import FileDownload from "material-ui/svg-icons/file/file-download";

export default class VideoComposer extends Component {
  onClickSaveWebm() {
    const ext = "webm";
    let a = document.createElement("a");
    a.href = this.props.src;
    a.download = `video_${Date.now()}.${ext}`;
    a.click();
        // window.URL.revokeObjectURL(this.props.src);
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
        <div>
          <div style={{display:"flex", width: "80%"}}>
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
            <div style={{flex: 1}}>
              <FlatButton
                    label="mp4"
                    icon={<FileDownload />}
                    primary={true}
                    onClick={() => alert("TODO: Herokuにwebm送ってmp4にするやつつくる")}

                    fullWidth={true}
                    style={{width: "100%"}}
                    />
            </div>
            <div style={{flex: 1}}>
              <FlatButton
                    label="gif"
                    icon={<FileDownload />}
                    primary={true}
                    onClick={() => alert("TODO: GifEncoder叩くけど時間かかるのでそれっぽいUI考える")}

                    fullWidth={true}
                    style={{width: "100%"}}
                    />
            </div>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    src: PropTypes.string.isRequired,
  }
}
