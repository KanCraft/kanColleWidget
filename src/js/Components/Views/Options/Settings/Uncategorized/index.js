import React, {Component,PropTypes} from "react";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Settings from "material-ui/svg-icons/action/settings";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Config from "../../../../Models/Config";
import Description from "../Description";

// 各項目はなるべく分離可能なように、ちゃんとクラスにする
export default class UncategorizedSettings extends Component {
    render() {
        return (
            <div>
              <h1 style={this.props.styles.title}><Settings /> 未分類の設定置き場</h1>
              <Description>わりと設定項目が細かいし隅々まで散らばってるので、セクションつくるほど類似した設定がない設定はここにつっこむ的な。</Description>
              <DamageSnapshotSetting />
            </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired,
    }
}

// 未分類クラス！！
class DamageSnapshotSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: Config.find("damageshapshot-window")
        };
    }
    render() {
        return (
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn>
                    大破進撃防止窓
                  </TableRowColumn>
                  <TableRowColumn>
                    <SelectField value={this.state.model.value} onChange={this.onChange.bind(this)}>
                      <MenuItem value="disabled" primaryText="使用しない"   />
                      <MenuItem value="inwindow" primaryText="ゲーム画面左上"/>
                      <MenuItem value="separate" primaryText="別窓表示"     />
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
