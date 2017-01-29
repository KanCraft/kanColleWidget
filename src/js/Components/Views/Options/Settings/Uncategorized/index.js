import React, {Component,PropTypes} from "react";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Settings from "material-ui/svg-icons/action/settings";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Toggle from "material-ui/Toggle";
import Config from "../../../../Models/Config";
import Description from "../Description";

// 各項目はなるべく分離可能なように、ちゃんとクラスにする
export default class UncategorizedSettings extends Component {
    render() {
        return (
            <div>
              <h1 style={this.props.styles.title}><Settings /> 未分類の設定置き場</h1>
              <Description>わりと設定項目が細かいし隅々まで散らばってるので、セクションつくるほど類似した設定がない設定はここにつっこむ的な。ゲーム内ボタン表示はとりあえずAPPモードのみ対応です。好評だったらWHITEモードにも追加します。</Description>
              <DashboardLayoutSetting />
              <PopupBackgroundImageSetting />
            </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired,
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
import FileSystem from "../../../../Services/Assets/FileSystem";
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
        // <img src={this.state.model.url} height="100%" onClick={() => this.iconInput.click()} style={styles.icon}/>
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
                  <div>
                    <small>運営電文表示時で280x600です</small>
                  </div>
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
