import React, {Component} from "react";
import {Client} from "chomex";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Rectangle from "../../Services/Rectangle";
import TrimService from "../../Services/TrimService";

import {Row, Col} from "../Grid";

import {ImageCell, EmptyCell, CameraCell} from "./Cells";

const client = new Client(chrome.runtime);

class DeckCaptureView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                row: 3, col: 2,
                rect: Rectangle.catalog.defaultDeckcapture,
            },
            pictures: [],
            whole: null
        };
        client.message("/window/capture").then(res => {
            this.setState({whole: res.data});
        });
    }
    getTileForIndex(idx) {
        if (this.state.pictures[idx]) return <Col key={idx}><ImageCell src={this.state.pictures[idx]} /></Col>;
        if (this.state.pictures.length != idx) return <Col key={idx}><EmptyCell /></Col>;
        return <Col key={idx}><CameraCell onClick={this.captureCurrentScreen.bind(this)} /></Col>;
    }
    getTilesUI() {
        const tiles = (Array.from(Array(this.state.config.row))).map((_, row) => {
            return (
              <Row key={`row-${row}`}>
                {(Array.from(Array(this.state.config.col))).map((_, col) => {
                    let idx = (row * this.state.config.col) + col;
                    return this.getTileForIndex(idx);
                })}
              </Row>
            );
        });
        return (
          <div style={{flex: 5, margin: "14px 14px 0 0"}}>
            {tiles}
            <RaisedButton
              label={`DONE (${this.state.config.row}×${this.state.config.col})`}
              disabled={(this.state.pictures.length != (this.state.config.row * this.state.config.col))}
              primary={true}
              onClick={this.onDoneButtonClicked.bind(this)}
              style={{width: "100%"}} />
          </div>
        );
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
            canvas.width = images[0].width * this.state.config.col;
            canvas.height = images[0].height * this.state.config.row;
            let ctx = canvas.getContext("2d");
            images.map((img, i) => {
                const c = i % this.state.config.col;
                const r = Math.floor(i / this.state.config.col);
                ctx.drawImage(img, c * img.width, r * img.height, img.width, img.height);
            });
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

    render() {
        return (
      <div style={{width: "80%", margin: "0 auto"}}>
        <div style={{display: "flex", width: "100%"}}>
          {this.getTilesUI()}
          <div style={{flex: 2, width:"240px"}}>
            <TextField
              ref="row" name="row" type="number"
              value={this.state.config.row} min={1} max={4}
              fullWidth={true}
              floatingLabelText="行"
              floatingLabelFixed={true}
              />
            <TextField
              ref="col" name="col" type="number"
              value={this.state.config.col} min={1} max={4}
              fullWidth={true}
              floatingLabelText="列"
              floatingLabelFixed={true}
              />
            {this.getWholeScreenView()}
            <TextField
              ref="x" name="x" type="number"
              value={100/2.55} step={0.1} min={0} max={100}
              fullWidth={true}
              floatingLabelText="x座標 (%)"
              floatingLabelFixed={true}
              />
            <TextField
              ref="y" name="y" type="number"
              value={100/5} step={0.1} min={0} max={100}
              fullWidth={true}
              floatingLabelText="y座標 (%)"
              floatingLabelFixed={true}
              />
            <TextField
              ref="width" name="width" type="number"
              value={100/1.66} step={0.1} min={1} max={100}
              fullWidth={true}
              floatingLabelText="幅 (%)"
              floatingLabelFixed={true}
              />
            <TextField
              ref="height" name="height" type="number"
              value={100/1.285} step={0.1} min={1} max={100}
              fullWidth={true}
              floatingLabelText="高さ (%)"
              floatingLabelFixed={true}
              />
          </div>
        </div>
      </div>
    );
    }
}

export default DeckCaptureView;
