import React, {Component,PropTypes} from "react";
import {TableRow, TableRowColumn} from "material-ui/Table";

import {grey500} from "material-ui/styles/colors";
import Delete from "material-ui/svg-icons/action/delete";

export default class ResourceRow extends Component {
  render() {
    const r = this.props.resource;
    return (
      <TableRow>
        <TableRowColumn>{new Date(r.created).format("MM/dd HH:mm")}</TableRowColumn>
        <TableRowColumn>{r.fuel}</TableRowColumn>
        <TableRowColumn>{r.ammo}</TableRowColumn>
        <TableRowColumn>{r.steel}</TableRowColumn>
        <TableRowColumn>{r.bauxite}</TableRowColumn>
        <TableRowColumn>{r.buckets}</TableRowColumn>
        <TableRowColumn style={{textAlign:"center"}}>
          <Delete color={grey500} style={{cursor:"pointer"}} onClick={this.onClickDelete.bind(this)}/>
        </TableRowColumn>
      </TableRow>
    );
  }
  onClickDelete() {
    const r = this.props.resource;
    const message = [
      "このレコードを削除しますか？",
      `id:\t${r._id}`,
      `日付:\t${new Date(r.created).toString()}`
    ].join("\n");
    if (window.confirm(message)) {
      this.props.resource.delete();
      this.props.refresh();
    }
  }
  static propTypes = {
    resource: PropTypes.object.isRequired,// TODO: shape
    refresh:  PropTypes.func.isRequired,
  }
}
