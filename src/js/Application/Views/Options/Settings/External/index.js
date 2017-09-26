import React, {Component,PropTypes} from "react";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Settings from "material-ui/svg-icons/action/settings";
import RaisedButton from "material-ui/RaisedButton";
import Description from "../Description";
import Detail from "../../Detail";
import Subscriber from "../../../../Models/Subscriber";

export default class ExternalExtensionView extends Component {
  render() {
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> 外部Chrome拡張との連携</h1>
        <Description>
          くわしくは<a href="https://github.com/otiai10/kanColleWidget/wiki/%E5%A4%96%E9%83%A8Chrome%E6%8B%A1%E5%BC%B5%E9%80%A3%E6%90%BA%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6">ここ</a>をみてください
        </Description>
        <Table>
          <TableBody>
            <ExternalAPIView />
          </TableBody>
        </Table>
      </div>
    );
  }
  static propTypes = {
    styles: PropTypes.object.isRequired,
  }
}

class ExternalAPIView extends Component {
  render() {
    return (
      <TableRow>
        <TableRowColumn>
          外部Chrome拡張の連携
          <Detail>リセットボタンを押すと登録されている外部Chrome拡張のリストはすべて削除されます。</Detail>
        </TableRowColumn>
        <TableRowColumn>
          <RaisedButton label="リセット" onClick={() => { Subscriber.drop(); location.reload(); }}/>
          <ul>
            {Subscriber.list().map(sub => (
              <li key={sub._id}>
                <b>{sub.label} <small>(ID: {sub._id})</small></b>
                <ul>
                  <li>{(new Date(sub.created)).toString()}</li>
                </ul>
              </li>
            ))}
          </ul>
        </TableRowColumn>
      </TableRow>
    );
  }
}
