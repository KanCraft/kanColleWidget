// TODO: さすがにでかすぎるので、分割してくれ、誰か氏〜

import React, {Component} from "react";
import Paper from "material-ui/Paper";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

import Avatar from "material-ui/Avatar";

import PictureInPictureAlt from "material-ui/svg-icons/action/picture-in-picture-alt";
import Gesture     from "material-ui/svg-icons/content/gesture";
import Crop        from "material-ui/svg-icons/image/crop";
import TextFields  from "material-ui/svg-icons/editor/text-fields";
import Divider     from "material-ui/Divider";
import Download    from "material-ui/svg-icons/file/file-download";
// import Send        from "material-ui/svg-icons/content/send";
import Refresh     from "material-ui/svg-icons/navigation/refresh";
import IconButton  from "material-ui/IconButton";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
// import RaisedButton from "material-ui/RaisedButton";
import Snackbar from "material-ui/Snackbar";

import TextField from "material-ui/TextField";
import {red500} from "material-ui/styles/colors";

import Icon from "../FontAwesome";

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

        this.getImageUriFromCurrentURL().then(uri => {
            Image.init(uri).then(img => {
                this.drawImage(img);
                this.setState({imageUri: uri});
            });
        });

        this.state = {
            tweetFeedbackMessage: "",
            dialogOpened: false,
            tweetAction: null,
            twitterProfile: null,
            nowSending: false,
        };

        client.message("/twitter/profile").then(response => {
            if (response.data) { this.setState({twitterProfile: response.data}); }
        });

    }

    getImageUriFromCurrentURL() {
        let params = (new URL(location.href)).searchParams;
        if (!params.get("datahash")) {
            return Promise.resolve(params.get("img"));
        }
        return new Promise(resolve => {
            chrome.storage.local.get(params.get("datahash"), (items) => {
                resolve(items[Object.keys(items)[0]]);
                chrome.storage.local.remove(params.get("datahash"));
            });
        });
    }

    drawImage(img) {
        this.refs.canvas.width = img.width;
        this.refs.canvas.height = img.height;
        this.refs.canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    }
    render() {
        var f = true;
        return (
          <div style={styles.container}>
            <div ref="contents" style={styles.flex}>
              <div style={{flex: 1}}>
                <canvas ref="canvas" style={{maxWidth: "100%", boxShadow: "0 1px 6px #a0a0a0"}}></canvas>
              </div>
              <div style={{flex: "initial", width: "100px"}}>
                <Paper style={styles.paper}>
                  <Menu>
                    <MenuItem primaryText={this.colorPicker()} />
                    <MenuItem disabled={true} primaryText={
                        <IconButton tooltip="(coming soon)">
                          <PictureInPictureAlt />
                        </IconButton>
                      }/>
                    <MenuItem disabled={true} primaryText={
                        <IconButton tooltip="(coming soon)">
                          <Gesture />
                        </IconButton>
                      }/>
                    <MenuItem disabled={true} primaryText={
                        <IconButton tooltip="(coming soon)">
                          <Crop />
                        </IconButton>
                      }/>
                    <MenuItem disabled={true} primaryText={
                        <IconButton tooltip="(coming soon)">
                          <TextFields />
                        </IconButton>
                      }/>
                    {(f) ? null : <MenuItem primaryText={<TextField fullWidth={true} />} />}
                    <Divider />
                    <MenuItem onTouchTap={this.onDownloadClicked.bind(this)} primaryText={
                        <IconButton tooltip="Download">
                          <Download />
                        </IconButton>
                    }/>
                    <MenuItem onTouchTap={this.onTweetClicked.bind(this)}    primaryText={
                        <IconButton tooltip="Tweet">
                          {this.getTwitterIcon()}
                        </IconButton>
                    }/>
                    <Divider />
                    <MenuItem onTouchTap={this.compressImageSize.bind(this)}
                      title={"画像ファイル容量を削減します"}
                      primaryText={this.getFileSizeText()}
                      style={(this.getFileSize() > 3*1000*1000) ? {color:red500} : null} />
                    <MenuItem onTouchTap={() => { location.reload(); }}  primaryText={
                        <IconButton tooltip="Refresh">
                          <Refresh />
                        </IconButton>
                    }/>
                  </Menu>
                </Paper>
              </div>
            </div>
            {this.getDialog()}
            {this.getTweetModal()}
            {this.getRequestTwitterAuthModal()}
            <Snackbar
              open={!!this.state.tweetFeedbackMessage}
              message={this.state.tweetFeedbackMessage}
              autoHideDuration={10000}
            />
          </div>
        );
    }
    onDownloadClicked() {
        this.setState({dialogOpened: true});
    }
    colorPicker() {
        return (
      <input type="color" style={{width: "100%"}}/>
    );
    }
    getTwitterIcon() {
        if (!this.state.twitterProfile) return <Icon name="twitter" size={20}/>;
        return <Avatar src={this.state.twitterProfile.profile_image_url} size={20} />;
    }
    onTweetClicked() {
        if (!this.state.twitterProfile) {
      // モーダルの内容を、連携してください的なやつにする
            this.setState({tweetAction: "auth"});
        } else {
      // モーダルの内容を、画像とテキストのやつにする
            this.setState({tweetAction: "tweet"});
        }
    }
    getRequestTwitterAuthModal() {
        const actions = [
            <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => { this.setState({tweetAction: null});}}
        />,
            <FlatButton
        label="Authenticate"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => {
            client.message("/twitter/auth").then(response => {
                this.setState({
                    twitterProfile: response.data,
                    tweetAction:    "tweet"
                });
            });
        }}
        />,
        ];
        return (
      <Dialog
        title="You should authenticate `艦これウィジェット` on Twitter"
        actions={actions}
        modal={false}
        open={(this.state.tweetAction == "auth")}
        >画像付きツイートはTwitterによる認証が必要です。自動的なツイートの投稿や操作はありません。[AUTHENTICATE]ボタンを押すと、Twitterのページにリダイレクトします。</Dialog>
    );
    }
    getTweetModal() {
        const actions = [
            <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => { this.setState({tweetAction: null});}}
        />,
            <FlatButton
        label="Tweet"
        primary={true}
        keyboardFocused={true}
        disabled={this.state.nowSending}
        onTouchTap={() => {
            const strict = true;
            this.setState({nowSending: true}, () => {
                client.message("/twitter/post_with_image", {
                    image: this.state.imageUri,
                    status: this.refs.tweettext.getValue(),
                    type: "image/jpeg" // うーん
                }, strict).then(response => {
                    this.setState({
                        tweetPermalink: response.data.permalink,
                        tweetFeedbackMessage: <a href={response.data.permalink} target="_blank" style={{color: "#2196F3"}}>{response.data.permalink}</a>,
                        tweetAction: null,
                        nowSending: false,
                    });
                }).catch(err => {
                    this.setState({
                        tweetFeedbackMessage: err.message,
                        tweetAction: null,
                        nowSending: false,
                    });
                });
            });
        }}
        />,
        ];
        return (
      <Dialog
        title="Tweet"
        actions={actions}
        modal={false}
        open={(this.state.tweetAction == "tweet")}
        >
        <div style={{display: "flex", width: "100%"}}>
          <div style={{flex: 2}}><img src={this.state.imageUri} style={{width: "90%"}} /></div>
          <div style={{flex: 3, padding: "0 10px"}}>
            <TextField
              name="tweettext"
              ref="tweettext"
              multiLine={true}
              rows={4}
              fullWidth={true}
              />
          </div>
        </div>
      </Dialog>
    );
    }

    getDialog() {
        const actions = [
            <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDialog.bind(this)}
        />,
            <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveFile.bind(this)}
        />,
        ];
        return (
      <Dialog
        title="Save file name"
        actions={actions}
        modal={false}
        open={this.state.dialogOpened}
        >
        ~/Downloads/<TextField name="foo" ref="filename"/>.png
      </Dialog>
    );
    }
    closeDialog() {
        this.setState({dialogOpened: false});
    }
    getFileSize() {
        if (!this.state.imageUri) return 0;
        return this.state.imageUri.length * (3/4);
    }
    getFileSizeText() {
        const size = this.getFileSize();
        if (size > 1000 * 1000) {
            return Math.floor(size/(10*1000))/100 + "M";
        }
        return Math.floor(size/100)/10 + "K";
    }
    saveFile() {
        const filename = this.refs.filename.getValue() + ".png";
        const url = this.refs.canvas.toDataURL();
        chrome.downloads.download({ url, filename }, (/* id */) => {
            this.setState({dialogOpened: false});
        });
    }
    compressImageSize() {
        const rate = this.getFileSize()/(3*1000*1000);
        let uri = this.refs.canvas.toDataURL("image/jpeg", rate);
        let url = new URL(location.href);
        url.searchParams.delete("datahash");
        url.searchParams.set("img", uri);
        location.href = url.toString();
    }
}
