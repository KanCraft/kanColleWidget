import React, {Component} from "react";
import PropTypes from "prop-types";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import Description from "../Description";
import Settings from "material-ui/svg-icons/action/settings";

import Mastodon from "../../../../Models/Mastodon";
import MastodonService from "../../../../../Services/Mastodon";
import { encode } from "punycode";

export default class MastodonSettingView extends Component {
  render() {
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> マストドン連携</h1>
        <Description>マストドンインスタンスへの画像投稿などができるようになる素晴らしい設定です。</Description>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                  インスタンス登録の認証
              </TableRowColumn>
              <TableRowColumn>
                <RaisedButton onClick={this.addInstance.bind(this)} label={"インスタンスの追加"} />
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
  addInstance() {
    const host = "mstdn.jp"; // DEBUG
    const s = new MastodonService(Mastodon);
    s.client(host).then(client => {
      const authURL = client.authURL({
        scopes: ["read", "write"],
        redirect: chrome.runtime.getURL("dest/html/options.html"),
        state: btoa(host),
      });
      console.log(authURL);
      // マストドンのページ行って『艦これウィジェット』を認証してもらって帰って来てね
      window.open(authURL);
    });
  }

  componentDidMount() {
    // 帰ってきたっぽいので、ここでなんかする
    const url = new URL(window.location.href);
    if (!url.searchParams.has("code")) return;
    const code = url.searchParams.get("code");
    const host = atob(url.searchParams.get("state") || "");
    if (host == "") return;

    const client = Mastodon.find(host).toMammutClient();
    client.token(code).then(token => {
      console.log(token);
    });
  }

  static propTypes = {
    styles: PropTypes.object.isRequired,
  }
}