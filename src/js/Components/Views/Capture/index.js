// TODO: さすがにでかすぎるので、分割してくれ、誰か氏〜

import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import Avatar from 'material-ui/Avatar';

import PictureInPictureAlt from 'material-ui/svg-icons/action/picture-in-picture-alt';
import Gesture     from 'material-ui/svg-icons/content/gesture';
import Crop        from 'material-ui/svg-icons/image/crop';
import TextFields  from 'material-ui/svg-icons/editor/text-fields';
import Divider     from 'material-ui/Divider';
import Download    from 'material-ui/svg-icons/file/file-download';
import Send        from 'material-ui/svg-icons/content/send';
import Refresh     from 'material-ui/svg-icons/navigation/refresh';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from 'material-ui/TextField';

import Icon from '../FontAwesome';

import {Client} from 'chomex';
const client = new Client(chrome.runtime);

const styles = {
  container: {
    margin: '32px auto',
    width: '96%',
  },
  flex: {
    display: 'flex',
    width: '100%'
  },
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '0 32px 16px 0',
  },
}
export default class CaptureView extends Component {
  constructor(props) {
    super(props);
    let url = new URL(location.href);
    Image.init(url.searchParams.get('img')).then(img => {
      this.drawImage(img);
    })

    this.state = {
      imageUri: url.searchParams.get('img'),
      dialogOpened: false,
      tweetAction: null,
      twitterProfile: null
    }

    client.message('/twitter/profile').then(response => {
      if (response.data) { this.setState({twitterProfile: response.data}); }
    });

  }
  drawImage(img) {
    this.refs.canvas.width = img.width;
    this.refs.canvas.height = img.height;
    this.refs.canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  }
  render() {
    return (
      <div style={styles.container}>
        <div ref="contents" style={styles.flex}>
          <div style={{flex: 1}}>
            <canvas ref="canvas" style={{maxWidth: '100%', boxShadow: '0 1px 6px #a0a0a0'}}></canvas>
          </div>
          <div style={{flex: 'initial', width: '100px'}}>
            <Paper style={styles.paper}>
              <Menu>
                <MenuItem primaryText={this.colorPicker()} />
                <MenuItem disabled={true} primaryText={<PictureInPictureAlt />} />
                <MenuItem disabled={true} primaryText={<Gesture />}             />
                <MenuItem disabled={true} primaryText={<Crop />}                />
                <MenuItem disabled={true} primaryText={<TextFields />}          />
                {(true) ? null : <MenuItem primaryText={<TextField style={{width: '100%'}} />} />}
                <Divider />
                <MenuItem onTouchTap={this.onDownloadClicked.bind(this)} primaryText={<Download />} />
                <MenuItem onTouchTap={this.onTweetClicked.bind(this)}    primaryText={this.getTwitterIcon()} />
                <Divider />
                <MenuItem primaryText={<Refresh />} onTouchTap={() => { location.reload(); }} />
              </Menu>
            </Paper>
          </div>
        </div>
        {this.getDialog()}
        {this.getTweetModal()}
        {this.getRequestTwitterAuthModal()}
      </div>
    )
  }
  onDownloadClicked() {
    this.setState({dialogOpened: true})
  }
  colorPicker() {
    return (
      <input type="color" style={{width: '100%'}}/>
    )
  }
  getTwitterIcon() {
    if (!this.state.twitterProfile) return <Icon name="twitter" />;
    return <Avatar src={this.state.twitterProfile.profile_image_url} size={20} />;
  }
  onTweetClicked() {
    if (!this.state.twitterProfile) {
      // モーダルの内容を、連携してください的なやつにする
      this.setState({tweetAction: 'auth'});
    } else {
      // モーダルの内容を、画像とテキストのやつにする
      this.setState({tweetAction: 'tweet'});
    }
  }
  getRequestTwitterAuthModal() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => { this.setState({tweetAction: null})}}
        />,
      <FlatButton
        label="Authenticate"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => {
          client.message('/twitter/auth').then(response => {
            this.setState({
              twitterProfile: response.data,
              tweetAction:    'tweet'
            })
          });
        }}
        />,
    ];
    return (
      <Dialog
        title="You should authenticate `艦これウィジェット` on Twitter"
        actions={actions}
        modal={false}
        open={(this.state.tweetAction == 'auth')}
        >画像付きツイートはTwitterによる認証が必要です。</Dialog>
    );
  }
  getTweetModal() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => { this.setState({tweetAction: null})}}
        />,
      <FlatButton
        label="Tweet"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => { this.setState({tweetAction: null})}}
        />,
    ];
    return (
      <Dialog
        title="Tweet"
        actions={actions}
        modal={false}
        open={(this.state.tweetAction == 'tweet')}
        >
        <div style={{display: 'flex', width: '100%'}}>
          <div style={{flex: 1}}><img src={this.state.imageUri} style={{width: '90%'}} /></div>
          <div style={{flex: 3, padding: '0 10px'}}>
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
  saveFile() {
    const filename = this.refs.filename.getValue() + '.png';
    const url = (new URL(location.href)).searchParams.get('img');
    chrome.downloads.download({ url, filename }, (id) => {
      this.setState({dialogOpened: false});
    });
  }
}
