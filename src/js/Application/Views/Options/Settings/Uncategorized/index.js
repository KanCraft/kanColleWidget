import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import Settings    from "material-ui/svg-icons/action/settings";
import SelectField from "material-ui/SelectField";
import MenuItem    from "material-ui/MenuItem";
import Description from "../Description";
import Detail      from "../../Detail";
import {
  MastodonConfig, MastodonConfigInput
} from "./Mastodon";

import Config   from "../../../../Models/Config";
import Mastodon from "../../../../Models/Mastodon";

export default class UncategorizedSettings extends Component {
  render() {
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> 未分類の設定置き場</h1>
        <Description>わりと設定項目が細かいし隅々まで散らばってるので、セクションつくるほど類似した設定がない設定はここにつっこむ的な。</Description>
        <DashboardLayoutSetting />
        <PopupBackgroundImageSetting />
        <StrictMissionRotation />
        <QuestManagerAlert />
        <MastodonInstanceSetting />
      </div>
    );
  }
  static propTypes = {
    styles: PropTypes.object.isRequired,
  }
}

class MastodonInstanceSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instances: Mastodon.list(),
    };
  }
  render() {
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>
              Mastodon連携
              <Detail>画像投稿先にマストドンインスタンスを選択できるようになります。各インスタンスを追加時じ、認証プロセスが起動します。</Detail>
            </TableRowColumn>
            <TableRowColumn>
              {this.state.instances.map(m => <MastodonConfig key={m.domain} {...m} del={m.delete.bind(m)} refresh={this.refresh.bind(this)} />)}
              <MastodonConfigInput refresh={this.refresh.bind(this)}/>
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  onClickRegisterButton() {
    const domain = "mstdn.jp";
    Mastodon.create({domain:domain,_id:domain});
    this.setState({instances:Mastodon.list()});
  }
  refresh() {
    this.setState({instances: Mastodon.list()});
  }
}

class StrictMissionRotation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: Config.find("strict-mission-rotation")
    };
  }
  render() {
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>
                  遠征強化令
                  <Detail>
                    一定時間、遠征帰投を回収していなかったり遠征に出していない艦隊があると、なんか知らせるようにします
                  </Detail>
            </TableRowColumn>
            <TableRowColumn>
              <div>
                <SelectField value={this.state.model.value} fullWidth={true} onChange={(ev, i, value) => {
                  let model = this.state.model; model.value = value; model.save(); this.setState({model});
                }}>
                  <MenuItem value={"disabled"}     primaryText={"無効"} />
                  <MenuItem value={"clockicon"}    primaryText={"発令: クロックモードのアイコンによる"} />
                  <MenuItem value={"notification"} primaryText={"発令: 通知ポップアップによる"} />
                </SelectField>
              </div>
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

class QuestManagerAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: Config.find("quest-manager-alert")
    };
  }
  render() {
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>
                  任務着手忘れ防止アラートを出す
                </TableRowColumn>
            <TableRowColumn>
              <div>
                <SelectField value={this.state.model.value} fullWidth={true} onChange={(ev, i, value) => {
                  let model = this.state.model; model.update({value}); this.setState({model});
                }}>
                  <MenuItem value={"disabled"}     primaryText={"無効"} />
                  <MenuItem value={"notification"} primaryText={"通知ポップアップを使う"} />
                  <MenuItem value={"alert"}        primaryText={"アラートダイアログを使う"} />
                </SelectField>
              </div>
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

class DashboardLayoutSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: Config.find("dashboard-layout")
    };
  }
  render() {
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>
                  クロックモードのレイアウト
                </TableRowColumn>
            <TableRowColumn>
              <SelectField value={this.state.model.value} onChange={this.onChange.bind(this)}>
                <MenuItem value="tab" primaryText="タブ表示"   />
                <MenuItem value="scroll" primaryText="スクロール表示"/>
              </SelectField>
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  onChange(ev, i, value) {
    let model = this.state.model;
    model.value = value;
    model.save();
    this.setState({model});
  }
}

import {grey400}  from "material-ui/styles/colors";
import Clear      from "material-ui/svg-icons/content/clear";
import Image      from "material-ui/svg-icons/image/image";
import FileSystem from "../../../../../Services/Assets/FileSystem";
class PopupBackgroundImageSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: Config.find("popup-background-image"),
    };
    this.prepareIconInput();
  }
  prepareIconInput() {
    this.iconInput = this.createFileInput("image/*");
  }
  createFileInput(accept) {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", accept);
    input.onchange = (ev) => {
      let fs = new FileSystem();
      fs.set("popup-background-image", ev.target.files[0])
      .then(({entry}) => {
        let model = this.state.model;
        model.url = entry.toURL() + `?timestamp=${Date.now()}`;
        console.log(model.url);
        model.save();
        this.setState({model});
        // location.reload(); // TODO: 結局iconの値が変わってないからre-renderされない
      }).catch(err => console.info("NG", err));
    };
    return input;
  }
  onIconDelete() {
    let fs = new FileSystem();
    fs.delete(this.state.model.url.split("/").pop()).then(()=> {
      let model = this.state.model;
      model.url = null;
      model.save();
      this.setState({model});
    });
  }
  getIconInput() {
    const styles = {
      icon: {
        cursor: "pointer",
        color:  grey400
      }
    };
    let html = window.document.querySelector("html");
    if (this.state.model.url) {
      html.style.backgroundImage = `url("${this.state.model.url}")`;
      return (
        <div style={{displey:"flex", justifyContents:"center", alignItems:"center", height:"48%"}}>
          <Clear style={{...styles.icon}} onClick={this.onIconDelete.bind(this)}/>
        </div>
      );
    }
    html.style.backgroundImage = "";
    return <div><Image style={styles.icon} onClick={() => this.iconInput.click()} /></div>;
  }
  render() {
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>
                  右上ポップアップの背景カスタマイズ
                  <Detail>運営電文表示時で280x600です</Detail>
            </TableRowColumn>
            <TableRowColumn>
              {this.getIconInput()}
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
