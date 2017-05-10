import React, {Component} from "react";

// Components
import NavigationBar            from "./Navigation/NavigationBar";
import SubNavigationBar         from "./Navigation/SubNavigationBar";
import DownloadFileDialog       from "./Dialogs/DownloadFileDialog";
import TweetDialog              from "./Dialogs/TweetDialog";
import RequestTwitterAuthDialog from "./Dialogs/RequestTwitterAuthDialog";
import ArchiveDialog            from "./Dialogs/ArchiveDialog";
import Snackbar                 from "material-ui/Snackbar";

import CaptureWindowURL from "../../Routine/CaptureWindowURL";
import FileSystem       from "../../Services/Assets/FileSystem";

import Canvas from "./Canvas";

import Tool from "./Tools/Base";

import Config from "../../Models/Config";
import Scrap  from "../../Models/Scrap";

import {Client} from "chomex";
const client = new Client(chrome.runtime);

const styles = {
  container: {
    margin: "32px auto",
    width: "96%",
  },
  flex: {
    display: "flex",
    width: "100%"
  },
  paper: {
    display: "inline-block",
    float: "left",
    margin: "0 32px 16px 0",
  },
};
export default class CaptureView extends Component {
  constructor(props) {
    super(props);

        // Initial State
    this.state = {
      snackbarMessage: "",
      dialogOpened: false,
      tweetAction: null,
      twitterProfile: null,
      nowSending: false,
      tool:       Tool,
      ext: Config.find("download-file-ext").value,
    };

        // Initialize canvas
    this.getImageUriFromCurrentURL()
        .then(Image.init)
        .then(img => {
          this.refs.canvas.initWithImage(img);
          this.setState({imageUri: img.src});
        });

        // Fetch Twitter Profile
    client.message("/twitter/profile").then(response => {
      if (response.data) { this.setState({twitterProfile: response.data}); }
    });
  }

  componentDidMount() {
        // まあとりあえずだよ
    window.document.body.addEventListener("keydown", (ev) => {
      if (ev.key == "Enter" && (ev.metaKey || ev.ctrlKey)) {
        this.onTweetClicked();
      }
    }, false);
  }

  getImageUriFromCurrentURL() {
    let params = (new URL(location.href)).searchParams;
    if (!params.get("datahash")) return Promise.resolve(params.get("img"));
    else return new Promise(resolve => {
      chrome.storage.local.get(params.get("datahash"), (items) => {
        resolve(items[Object.keys(items)[0]]);
        chrome.storage.local.remove(params.get("datahash"));
      });
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.flex}>
          <NavigationBar
                onColorChanged={this.onColorChanged.bind(this)}
                twitterProfile={this.state.twitterProfile}
                compressImageSize={this.compressImageSize.bind(this)}
                getFileSize={this.getFileSize.bind(this)}
                getFileSizeText={this.getFileSizeText.bind(this)}
                onTweetClicked={this.onTweetClicked.bind(this)}
                onDownloadClicked={this.onDownloadClicked.bind(this)}
                onArchiveClicked={this.onArchiveClicked.bind(this)}
                onClickUndo={this.onClickUndo.bind(this)}
                setTool={this.setTool.bind(this)}
                selectedTool={this.state.tool.name}
              />
          <div style={{flex: 1}}>
            <SubNavigationBar
                  ref="subnav"
                  onColorChanged={this.onColorChanged.bind(this)}
                />
            <Canvas ref="canvas" getTool={this.getTool.bind(this)} ext={this.state.ext}/>
          </div>
        </div>
        <DownloadFileDialog
              ref="filename"
              dialogOpened={this.state.dialogOpened}
              closeDialog={this.closeDialog.bind(this)}
              saveFile={this.saveFile.bind(this)}
            />
        <TweetDialog
              ref="tweettext"
              tweet={this.tweet.bind(this)}
              tweetAction={this.state.tweetAction}
              getImageURI={this.getImageURI.bind(this)}
              nowSending={this.state.nowSending}
              closeDialog={this.closeDialog.bind(this)}
              onTweetKeyMapEntered={() => this.tweet()}
            />
        <RequestTwitterAuthDialog
              auth={this.auth.bind(this)}
              tweetAction={this.state.tweetAction}
              closeDialog={this.closeDialog.bind(this)}
            />
        <ArchiveDialog
              ref="archive"
              opened={this.state.archiveDialogOpened}
              close={() => this.setState({archiveDialogOpened: false})}
              saveAsArchive={this.saveAsArchive.bind(this)}
            />
        <Snackbar
              open={!!this.state.snackbarMessage}
              message={this.state.snackbarMessage}
              autoHideDuration={10000}
            />
      </div>
    );
  }
  onDownloadClicked() {
    this.setState({dialogOpened: true});
  }
  onArchiveClicked() {
    this.setState({archiveDialogOpened: true});
  }
  onTweetClicked() {
    if (!this.state.twitterProfile) this.setState({tweetAction: "auth"});
    else this.setState({tweetAction: "tweet"});
  }
  auth() {
    client.message("/twitter/auth").then(response => {
      this.setState({
        twitterProfile: response.data,
        tweetAction:    "tweet"
      });
    });
  }
  tweet() {
    this.setState({nowSending: true}, () => {
      client.message("/twitter/post_with_image", {
        image: this.getImageURI(),
        status: this.refs.tweettext.getValue(),
        reply: this.refs.tweettext.getReply(),
        type: "image/jpeg" // うーん
      }).then(response => {
        this.setState({
          tweetPermalink: response.data.permalink,
          snackbarMessage: <a
                    href={response.data.permalink}
                    target="_blank"
                    style={{color: "#2196F3"}}
                    >{response.data.permalink}</a>,
          tweetAction: null,
          nowSending: false,
        });
      }).catch(err => {
        this.setState({
          snackbarMessage: err.message,
          tweetAction: null,
          nowSending: false,
        });
      });
    });
  }
  closeDialog() {
    this.setState({dialogOpened: false, tweetAction: null});
  }
  getFileSize() {
    if (!this.state.imageUri) return 0;
    return this.getImageURI().length * (3/4);
  }
  getFileSizeText() {
    const size = this.getFileSize();
    if (size > 1000 * 1000) {
      return Math.floor(size/(10*1000))/100 + "M";
    }
    return Math.floor(size/100)/10 + "K";
  }
  saveFile() {
    const filename = this.refs.filename.getValue() + "." + this.state.ext;
    const url = this.refs.canvas.toDataURL();
    chrome.downloads.download({ url, filename }, () => {
      this.setState({dialogOpened: false});
    });
  }
  saveAsArchive(name) {
    const fs = new FileSystem();
    const url = this.refs.canvas.toDataURL();
    const mimetype = fs.getMimeType(url);
    let scrap = Scrap.new();
    scrap.name = name;
    scrap.filename += `.${mimetype.split("/")[1]}`;
    fs.fileFromBase64(url, scrap.filename, mimetype).then(f => {
      return fs.set(scrap.filename, f);
    }).then(({entry}) => {
      scrap.created = Date.now();
      scrap.url = entry.toURL();
      scrap.save();
      this.setState({
        archiveDialogOpened: false,
        snackbarMessage: <a
                  href="/dest/html/archive.html"
                  target="_blank"
                  style={{color: "#2196F3"}}
                  >アーカイブに保存しました 確認</a>,
      });
    }).catch(err => {
      this.setState({
        archiveDialogOpened: false,
        snackbarMessage: `保存失敗: ${err}`,
      });
    });
  }
  onClickUndo() {
    this.refs.canvas.undo();
  }
  onColorChanged(ev) {
    this.setState({color: ev.target.value});
  }
  setTool(tool) {
    this.setState({tool});
  }
  getTool(canvas) {
    const params = {
      color: this.state.color,
      text:  this.refs.subnav.getText(),
      size:  this.refs.subnav.getSize(),
      font:  this.refs.subnav.getFont(),
      fill:  this.refs.subnav.getFill(),
    };
    return new this.state.tool(canvas, params);
  }
  compressImageSize() {
    this.refs.canvas.getSmallerImageURI().then(uri => {
      let url = new CaptureWindowURL(Date.now());
      return url.params(uri);
    }).then(params => {
      let current = new URL(location.href);
      params.set("text", current.searchParams.get("text"));
      location.href = "?" + params.toString();
    });
  }
  getImageURI() {
    if (!this.refs.canvas) return this.state.imageUri;
    return this.refs.canvas.toDataURL();
  }
}
