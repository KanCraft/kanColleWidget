import React, {Component} from "react";

import {GridList, GridTile} from "material-ui/GridList";
import IconButton           from "material-ui/IconButton";
import Delete               from "material-ui/svg-icons/action/delete";
import Clear                from "material-ui/svg-icons/content/clear";
import FileDownload         from "material-ui/svg-icons/file/file-download";
import TextField            from "material-ui/TextField";
import Dialog               from "material-ui/Dialog";
import {grey500}            from "material-ui/styles/colors";

import Scrap      from "../../Models/Scrap";
import FileSystem from "../../../Services/Assets/FileSystem";

export default class ArchiveView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scraps: Scrap.list(),
      query:  "",
      shown: {},
    };
  }
  onClickDownload(scrap, ev) {
    ev.stopPropagation(); ev.preventDefault();
    let a = document.createElement("a");
    a.href = scrap.url;
    a.download = scrap.name;
    a.click();
  }
  onClickDelete(scrap, ev) {
    ev.stopPropagation(); ev.preventDefault();
    if (!window.confirm(`「${scrap.name}」を削除しますか？`)) return;
    const fs = new FileSystem();
    fs.delete(scrap.filename).then(() => {
      scrap.delete();
      this.setState({scraps: Scrap.list(), shown: {}});
    }).catch(err => {
      window.alert(JSON.stringify(err));
    });
  }
  onQueryChanged(ev) {
    const q = ev.target.value;
    const f = q ? s => s.name.match(q) : () => true;
    this.setState({
      scraps: Scrap.filter(f),
      query: q,
    });
  }
  showScrap(scrap) {
    this.setState({shown: scrap});
  }
  _getTiles() {
    return this.state.scraps.map(scrap => {
      return (
        <GridTile
                key={scrap._id}
                title={scrap.name}
                subtitle={<span>{(new Date(scrap.created)).toString()}</span>}
                onClick={() => this.showScrap(scrap)}
                style={{cursor:"pointer"}}
                >
          <img src={scrap.url} />
        </GridTile>
      );
    });
  }
  _getNotFoundMessage() {
    const style = {
      color: grey500,
    };
    return (
      <p style={style}>該当するアーカイブがありません。アーカイブは、スクショ編集画面の左のツールバーから保存できます。</p>
    );
  }
  render() {
    const actions = [
      <IconButton onClick={ev => this.onClickDownload(this.state.shown, ev)}><FileDownload /></IconButton>,
      <IconButton onClick={ev => this.onClickDelete(this.state.shown, ev)}><Delete /></IconButton>,
      <IconButton onClick={ev => {ev.preventDefault();ev.stopPropagation();this.setState({shown:{}});}}><Clear /></IconButton>,
    ];
    return (
      <div>
        <div>
          <TextField
                      name="search" fullWidth={true}
                      value={this.state.query}
                      onChange={this.onQueryChanged.bind(this)}
                    />
        </div>
        {this.state.scraps.length ? <GridList>{this._getTiles()}</GridList> : this._getNotFoundMessage()}
        <Dialog
                  open={!!this.state.shown._id}
                  title={this.state.shown.name}
                  titleStyle={{fontSize:"1.4em"}}
                  onRequestClose={() => this.setState({shown:{}})}
                  bodyStyle={{padding:0}}
                  autoScrollBodyContent={true}
                  actions={actions}
                >
          <img src={this.state.shown.url} style={{maxWidth: "100%", maxHeight:"100%"}} />
        </Dialog>
      </div>
    );
  }
}
