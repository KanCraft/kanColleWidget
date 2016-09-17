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


import TextField from 'material-ui/TextField';

import Icon from '../FontAwesome';

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
          <div style={{flex: 'initial', width: '224px'}}>
            <Paper style={styles.paper}>
              <Menu>
                <MenuItem primaryText={this.colorPicker()} />
                <MenuItem primaryText="Rect" disabled={true} leftIcon={<PictureInPictureAlt />} />
                <MenuItem primaryText="Draw" disabled={true} leftIcon={<Gesture />}             />
                <MenuItem primaryText="Text" disabled={true} leftIcon={<TextFields />}          />
                <MenuItem primaryText="Crop" disabled={true} leftIcon={<Crop />}                />
                {(true) ? null : <MenuItem primaryText={<TextField style={{width: '100%'}} />} />}
                <Divider />
                <MenuItem primaryText="Download" leftIcon={<Download />} />
                <MenuItem primaryText="Tweet"    leftIcon={<Avatar src="http://cdn1.www.st-hatena.com/users/ot/otiai10/profile.gif?1381366697" size={20} />} />
                <Divider />
                <MenuItem primaryText="Reset"    leftIcon={<Refresh />} />
              </Menu>
            </Paper>
          </div>
        </div>
      </div>
    )
  }

  colorPicker() {
    return (
      <input type="color" style={{width: '100%'}}/>
    )
  }
}
