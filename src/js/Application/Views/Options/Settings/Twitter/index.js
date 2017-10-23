import React, {Component} from "react";
import PropTypes from "prop-types";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Toggle      from "material-ui/Toggle";
import TextField   from "material-ui/TextField";
import Detail      from "../../Detail";
import Settings    from "material-ui/svg-icons/action/settings";
import Avatar      from "material-ui/Avatar";
import Description from "../Description";
import Config from "../../../../Models/Config";

import {Client} from "chomex";

export default class TwitterSettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      staff:   Config.find("staff-tweet"),
      hashtag: Config.find("tweet-hashtag"),
    };
    this.client = new Client(chrome.runtime);
    this.client.message("/twitter/profile").then(({data}) => {
      this.setState({profile: data});
    });
  }
  onTwitterAuthToggle(ev, value) {
    if (value) this.client.message("/twitter/auth").then(({data}) => {
      this.setState({profile: data});
    });
    else this.client.message("/twitter/revoke").then(() => {
      let staff = this.state.staff;
      staff.value = false;
      staff.save();
      this.setState({profile: null, staff});
    });
  }
  onStaffTwitterToggle(ev, value) {
    let staff = this.state.staff;
    staff.value = value;
    staff.save();
    this.setState({staff});
  }
  render() {
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> Twitter連携など</h1>
        <Description>運営電文を取得する方法が変わったため、Twitter連携が必須となりました。</Description>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                    Twitter連携
                    {this.state.profile ?
                      <div style={{display:"flex", alignItems:"center"}}>
                        <Avatar src={this.state.profile.profile_image_url} size={24} />
                        <span style={{paddingLeft: "12px"}}>@{this.state.profile.screen_name}</span>
                      </div>:
                      null
                    }
              </TableRowColumn>
              <TableRowColumn>
                <Toggle
                      onToggle={this.onTwitterAuthToggle.bind(this)}
                      toggled={!!this.state.profile}
                      />
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>運営電文</TableRowColumn>
              <TableRowColumn>
                <Toggle
                      onToggle={this.onStaffTwitterToggle.bind(this)}
                      toggled={!!this.state.profile && !!this.state.staff.value}
                      />
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>
                ツイート時ハッシュタグ
                <Detail>この入力がそのまま付与されます。# は自分でつけてください</Detail>
              </TableRowColumn>
              <TableRowColumn>
                <TextField
                  hintText="#艦これ"
                  fullWidth={true}
                  onChange={ev => {
                    this.state.hashtag.update({text: ev.target.value});
                    this.setState({hashtag: this.state.hashtag});
                  }}
                  value={this.state.hashtag.text}
                />
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
  static propTypes = {
    styles: PropTypes.any
  }
}
