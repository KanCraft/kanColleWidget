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

    // {{{ TODO: Modalを出してhost（ないしcomplete URL）を入力させ、それを取得する
    const host = "mstdn.jp";
    // }}}

    const m = Mastodon.find(host);

    if (m && m.hasAccessToken()) {
      // {{{ デバッグ用ブロック
      // const client = m.toMammutClient();
      // client.toot("クローム拡張のJSから投稿テスト").then(res => {
      //   console.log("OK!", res);
      // }).catch(err => {
      //   console.log("NG?", err);
      // });
      // }}}
      window.alert(`インスタンス ${host} はすでに登録されています。`);
      return;
    }

    const s = new MastodonService(Mastodon);
    s.client(host).then(client => {
      const authURL = client.authURL({
        scopes: ["read", "write"],
        state: btoa(host),
      });
      // マストドンのページ行って『艦これウィジェット』を認証して
      // Authorization Codeを付与して帰ってきてもらう。
      window.open(authURL);
      window.close();
    });
  }

  componentDidMount() {

    // もしかしたらAuthorizationのredirectで帰ってきたやつかもしれないからチェックする
    const url = new URL(window.location.href);
    if (!url.searchParams.has("code")) return;
    const code = url.searchParams.get("code");
    const host = atob(url.searchParams.get("state") || "");
    if (host == "") return;

    // 帰ってきたっぽいので、得られたAuthorization Codeを使って、
    // ユーザのAccessTokenを取得する
    const client = Mastodon.find(host).toMammutClient();
    client.token(code).then(client => {
      // AccessTokenを持っているので、ここでsaveする。
      Mastodon.fromMammutClient(client).save();
      // TODO: ここでReact.Componentのstateを更新し、一覧に表示する
      // TODO: ここで、window.alertでいいので、成功のフィードバックをする
    });
  }

  static propTypes = {
    styles: PropTypes.object.isRequired,
  }
}