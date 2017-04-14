import React, {Component,PropTypes} from "react";
import {TableRow, TableHeaderColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import c from "../../../Constants/colors";
import {Client} from "chomex";

export default class ResourceRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowloading: false,
    };
  }
  onClick() {
    this.setState({nowloading:true});
    const client = new Client(chrome.runtime);
    client.message("/resources/capture").then(() => {
      setTimeout(() => {
        this.setState({nowloading:false}, () => {
          this.props.refresh();
        });
      }, 100);
    }).catch(err => {
      this.setState({nowloading:false});
      window.alert(JSON.stringify(err));
    });
  }
  render() {
    return (
      <TableRow>
        <TableHeaderColumn>日付</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.fuel}}>燃料</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.ammo}}>弾薬</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.steel}}>鋼材</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.bauxite}}>ボーキサイト</TableHeaderColumn>
        <TableHeaderColumn style={{color:c.buckets}}>修復材</TableHeaderColumn>
        <TableHeaderColumn>
          <RaisedButton disabled={this.state.nowloading} onClick={this.onClick.bind(this)} style={{width:"100%"}} label="取得" />
        </TableHeaderColumn>
      </TableRow>
    );
  }
  static propTypes = {
    refresh: PropTypes.func.isRequired,
  }
}
