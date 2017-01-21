import React, {Component, PropTypes} from "react";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import Toggle      from "material-ui/Toggle";
import Settings    from "material-ui/svg-icons/action/settings";
import Avatar      from "material-ui/Avatar";
import Description from "../Description";

import {Client} from "chomex";

export default class TwitterSettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null
        };
        this.client = new Client(chrome.runtime);
        this.client.message("/twitter/profile").then(({data}) => {
            console.log(data);
            this.setState({profile: data});
        });
    }
    onTwitterAuthToggle(ev, value) {
        if (value) this.client.message("/twitter/auth").then(({data}) => {
            this.setState({profile: data});
        });
        else this.client.message("/twitter/revoke").then(() => {
            this.setState({profile: null});
        });
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
              </TableBody>
            </Table>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.any
    }
}
