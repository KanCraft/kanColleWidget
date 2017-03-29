import React, {Component} from "react";
import {Client} from "chomex";

import TextField    from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import SelectField  from "material-ui/SelectField";
import MenuItem     from "material-ui/MenuItem";
import FlatButton   from "material-ui/FlatButton";
import Dialog       from "material-ui/Dialog";

import Rectangle from "../../Services/Rectangle";
import TrimService from "../../Services/TrimService";

import {Row, Col} from "../Grid";

import {ImageCell, EmptyCell, CameraCell} from "./Cells";

import DeckCaptureConfig from "../../Models/DeckCaptureConfig";

const client = new Client(chrome.runtime);

class DeckCaptureView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: DeckCaptureConfig.find("normal"),
      pictures: [],
      whole: null,
      settings: DeckCaptureConfig.list(),
      modified: false,
      openSaveSettingDialog: false,
      settingName: "", // TODO: これなんかもダイアログ分離して置くべき
    };
    client.message("/window/capture").then(res => {
      this.setState({whole: res.data});
    });
  }
  deleteCell(idx) {
    this.state.pictures.splice(idx, 1);
    this.setState({pictures: this.state.pictures});
  }
  getTileForIndex(idx) {
    if (this.state.pictures[idx]) return <Col key={idx}><ImageCell src={this.state.pictures[idx]} index={idx} deleteCell={this.deleteCell.bind(this)} /></Col>;
    if (this.state.pictures.length != idx) return <Col key={idx}><EmptyCell /></Col>;
    return <Col key={idx}><CameraCell onClick={this.captureCurrentScreen.bind(this)} /></Col>;
  }
  getTilesUI() {
    return (
      <div style={{flex: 5, margin: "14px 14px 0 0"}}>
        <div style={{marginBottom: "12px"}}>
          <div style={{display: "flex"}}>
            {this.getTilesForPanel(0)}
            {/* TODO: ここもっと抽象化できるんだけど、オーバーキルなような気もする */}
            {(this.state.config.panels > 1) ? this.getTilesForPanel(1) : null}
          </div>
        </div>
        <RaisedButton
              label={`DONE (${this.state.config.row}×${this.state.config.col})`}
              disabled={this.state.pictures.length == 0}
              primary={true}
              onClick={this.onDoneButtonClicked.bind(this)}
              style={{width: "100%"}} />
      </div>
    );
  }
  getTilesForPanel(panel) {
    const origin = panel * (this.state.config.row * this.state.config.col);
    return <div style={{flex: "1"}}>{(Array.from(Array(this.state.config.row))).map((_, row) => {
      return (
        <Row key={`row-${row}`}>
          {(Array.from(Array(this.state.config.col))).map((_, col) => {
            let idx = origin + (row * this.state.config.col) + col;
            return this.getTileForIndex(idx);
          })}
        </Row>
      );
    })}</div>;
  }
  captureCurrentScreen() {
    Promise.resolve().then(() => {
      return client.message("/window/capture");
    }).then(res => {
      return Image.init(res.data);
    }).then(img => {
      const rect = new Rectangle(0, 0, img.width, img.height).removeBlackspace();
      return Promise.resolve({img, rect});
    }).then(({img, rect}) => {
      const trims = new TrimService(img.src);
      return trims.trim(rect.transform(this.state.config.rect));
    }).then(uri => {
      this.state.pictures.push(uri);
      this.setState({pictures: this.state.pictures});
    });
  }

  getWholeScreenView() {
    const areaIndicateStyle = {
      position: "absolute",
      left:   `${this.state.config.rect.x * 100}%`,
      top:    `${this.state.config.rect.y * 100}%`,
      width:  `${this.state.config.rect.width * 100}%`,
      height: `${this.state.config.rect.height * 100}%`,
      backgroundColor: "rgba(0,0,0,0.6)"
    };
    return (
      <div style={{position: "relative"}}>
        <div style={areaIndicateStyle} />
        <img src={this.state.whole} width="100%" />
      </div>
    );
  }

  onDoneButtonClicked() {
    let canvas = document.createElement("canvas");
    Promise.all(this.state.pictures.map(Image.init)).then(images => {
      canvas.width  = images[0].width * this.state.config.col * (this.state.config.panels || 1);
      canvas.height = images[0].height * this.state.config.row;
      let ctx = canvas.getContext("2d");
      var panel = -1;
      images.map((img, i) => {
        if (i % (this.state.config.row * this.state.config.col) == 0) panel++;
        const c = i % this.state.config.col + (this.state.config.col * panel);
        const r = Math.floor(i / this.state.config.col) % this.state.config.row;
        ctx.drawImage(img, c * img.width, r * img.height, img.width, img.height);
      });
            // 中央分離線をひく
      if (this.state.config.panels > 1) {
        for (let i = 1; i < this.state.config.panels; i++) {
          const x = images[0].width * this.state.config.col * i;
          const h = images[0].height * this.state.config.row;
          ctx.fillStyle = "#4e8252";
          ctx.fillRect(x - 4, 0, 8, h);
        }
      }
      let params = new URLSearchParams();
      let uri = canvas.toDataURL();
            // とりあえず
      if (uri.length > 1 * Math.pow(10, 6)) {
        const hash = `kcw:tmp:deckimage:${Date.now()}`;
        chrome.storage.local.set({[hash]:uri}, () => {
          params.set("datahash", hash);
          window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
        });
      } else {
        params.set("img", canvas.toDataURL());
        window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
      }
    });
  }
  onGridChanged(ev) {
    let config = this.state.config;
    config[ev.target.name] = parseInt(ev.target.value);
    this.setState({config, modified:true});
  }
  onRectChanged(ev) {
    let config = this.state.config;
    config.rect[ev.target.name] = ev.target.value / 100;
    this.setState({config, modified:true});
  }
  handleSaveSettingDialogClose() {
    this.setState({openSaveSettingDialog: false});
  }
  openSaveSettingDialog() {
    this.setState({openSaveSettingDialog: true});
  }
  onChangeSettingName(ev) {
    this.setState({settingName: ev.target.value});
  }
  saveSetting() {
    DeckCaptureConfig.create(this.getCurrentSetting());
    this.setState({openSaveSettingDialog: false});
  }
  getCurrentSetting() {
    return {
      row: this.state.config.row,
      col: this.state.config.col,
      rect: {
        x:      this.state.config.rect.x,
        y:      this.state.config.rect.y,
        width:  this.state.config.rect.width,
        height: this.state.config.rect.height,
      },
      name: this.state.settingName,
    };
  }
  getJSONizedSetting() {
    return JSON.stringify(this.getCurrentSetting(), null, 4);
  }
  onChangeSetting(ev, index, name) {
    client.message("/window/capture").then(res => {
      this.setState({
        whole: res.data,
        config: this.state.settings.filter(s => s.name == name).pop()
      });
    });
  }
  render() {
    return (
      <div style={{width: "80%", margin: "0 auto"}}>
        <div style={{display: "flex", width: "100%"}}>
          {this.getTilesUI()}
          <div style={{flex: 2, width:"240px"}}>
            <SelectField value={this.state.config.name} fullWidth={true} underlineStyle={{color: "red"}} onChange={this.onChangeSetting.bind(this)}>
              {this.state.settings.map(s => {
                return <MenuItem value={s.name} key={s.name} primaryText={s.name} disabled={s.disabled}/>;
              })}
            </SelectField>
            <TextField
                  ref="row" name="row" type="number"
                  value={this.state.config.row} min={1} max={4}
                  fullWidth={true}
                  floatingLabelText="行"
                  floatingLabelFixed={true}
                  onChange={this.onGridChanged.bind(this)}
                  />
            <TextField
                  ref="col" name="col" type="number"
                  value={this.state.config.col} min={1} max={4}
                  fullWidth={true}
                  floatingLabelText="列"
                  floatingLabelFixed={true}
                  onChange={this.onGridChanged.bind(this)}
                  />
            {this.getWholeScreenView()}
            <TextField
                  ref="x" name="x" type="number"
                  value={this.state.config.rect.x * 100} step={1} min={0} max={100}
                  fullWidth={true}
                  floatingLabelText="x座標 (%)"
                  floatingLabelFixed={true}
                  onChange={this.onRectChanged.bind(this)}
                  />
            <TextField
                  ref="y" name="y" type="number"
                  value={this.state.config.rect.y * 100} step={1} min={0} max={100}
                  fullWidth={true}
                  floatingLabelText="y座標 (%)"
                  floatingLabelFixed={true}
                  onChange={this.onRectChanged.bind(this)}
                  />
            <TextField
                  ref="width" name="width" type="number"
                  value={this.state.config.rect.width * 100} step={1} min={1} max={100}
                  fullWidth={true}
                  floatingLabelText="幅 (%)"
                  floatingLabelFixed={true}
                  onChange={this.onRectChanged.bind(this)}
                  />
            <TextField
                  ref="height" name="height" type="number"
                  value={this.state.config.rect.height * 100} step={1} min={1} max={100}
                  fullWidth={true}
                  floatingLabelText="高さ (%)"
                  floatingLabelFixed={true}
                  onChange={this.onRectChanged.bind(this)}
                  />
            <FlatButton label="↑この設定に名前をつけて保存" primary={true} style={{width:"100%"}} onClick={this.openSaveSettingDialog.bind(this)} disabled={!this.state.modified}/>
            {this.state.config.protected ? null : <FlatButton label="この設定を削除" secondary={true} style={{width:"100%"}} onClick={() => this.state.config.delete() && location.reload()} />}
            {/* TODO: このダイアログ分離したよほうがいいぞ */}
            <Dialog
                  title="この設定に名前をつけて保存"
                  open={this.state.openSaveSettingDialog}
                  onRequestClose={this.handleSaveSettingDialogClose.bind(this)}
                  >
              <div style={{display:"flex"}}>
                <div style={{flex:"1", overflow:"scroll"}}>
                  <pre style={{fontSize: "0.8em"}}>{this.getJSONizedSetting()}</pre>
                </div>
                <div style={{flex:"1"}}>
                  <div style={{width:"80%", margin: "0 auto"}}>{this.getWholeScreenView()}</div>
                </div>
              </div>
              <TextField hintText="この設定の名前" onChange={this.onChangeSettingName.bind(this)}/>
              <FlatButton label="DONE" primary={true} disabled={this.state.settingName.length == 0} onClick={this.saveSetting.bind(this)}/>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
}

export default DeckCaptureView;
