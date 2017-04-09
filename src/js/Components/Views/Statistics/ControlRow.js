import React, {Component,PropTypes} from "react";
import {TableRow, TableHeaderColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";

import {Client} from "chomex";

export default class ResourceRow extends Component {
  onClick() {
    const client = new Client(chrome.runtime);
    client.message("/resources/capture").then(() => this.props.refresh());
  }
  render() {
    return (
      <TableRow>
        <TableHeaderColumn>日付</TableHeaderColumn>
        <TableHeaderColumn>燃料</TableHeaderColumn>
        <TableHeaderColumn>弾薬</TableHeaderColumn>
        <TableHeaderColumn>鋼材</TableHeaderColumn>
        <TableHeaderColumn>ボーキサイト</TableHeaderColumn>
        <TableHeaderColumn>修復材</TableHeaderColumn>
        <TableHeaderColumn>
          <RaisedButton onClick={this.onClick.bind(this)} style={{width:"100%"}} label="取得" />
        </TableHeaderColumn>
      </TableRow>
    );
  }
  static propTypes = {
    refresh: PropTypes.func.isRequired,
  }
}
