import React, {Component} from "react";
import PropTypes from "prop-types";
import {TableRow, TableRowColumn} from "material-ui/Table";

import {grey500} from "material-ui/styles/colors";
import Delete from "material-ui/svg-icons/action/delete";

class ResourceCol extends Component {
  render() {
    return (
      <TableRowColumn style={{cursor:"pointer"}} onClick={() => this.props.edit()}>
        {this.props.children}
      </TableRowColumn>
    );
  }
  static propTypes = {
    children: PropTypes.number.isRequired,
    name:     PropTypes.string.isRequired,
    edit:     PropTypes.func.isRequired,
  }
}

export default class ResourceRow extends Component {
  render() {
    const r = this.props.resource;
    return (
      <TableRow>
        <TableRowColumn>{new Date(r.created).format("MM/dd HH:mm")}</TableRowColumn>
        <ResourceCol name={"fuel"}     edit={this.props.edit}>{r.fuel}</ResourceCol>
        <ResourceCol name={"ammo"}     edit={this.props.edit}>{r.ammo}</ResourceCol>
        <ResourceCol name={"steel"}    edit={this.props.edit}>{r.steel}</ResourceCol>
        <ResourceCol name={"bauxite"}  edit={this.props.edit}>{r.bauxite}</ResourceCol>
        <ResourceCol name={"buckets"}  edit={this.props.edit}>{r.buckets}</ResourceCol>
        <ResourceCol name={"material"} edit={this.props.edit}>{r.material}</ResourceCol>
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
    edit:     PropTypes.func.isRequired,
  }
}
