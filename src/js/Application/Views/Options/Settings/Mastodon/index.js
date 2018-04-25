import React, {Component} from "react";
import PropTypes from "prop-types";

import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Settings from "material-ui/svg-icons/action/settings";
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import InstanceView from "./Instance";
import Description from "../Description";

import Mastodon from "../../../../Models/Mastodon";
import MastodonService from "../../../../../Services/Mastodon";

export default class MastodonSettingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInputModal: false,
      showCallbackModal: false, // AuthのRedirectで戻ってきたとき出すモーダルです
      requesting: false,
      connected: null, // 今まさに登録されたインスタンスのオブジェクト
      instances: Mastodon.list(),
      input: '',
    };
  }
  render() {
    return (
      <div>
        <h1 style={this.props.styles.title}><Settings /> マストドン連携</h1>
        <Description>マストドンインスタンスへの画像投稿などができるようになる素晴らしい設定です。</Description>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                  インスタンス登録
                  {this.renderInstanceDialog()}
                  {this.renderCallbackDialog()}
              </TableRowColumn>
              <TableRowColumn>
                {this.state.instances.map((instance, i) => <InstanceView key={i} {...instance} />)}
                  <RaisedButton onClick={() => this.setState({showInputModal: true})} label={"インスタンスの追加"} />
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
  renderCallbackDialog() {
    const actions = [
      <FlatButton
        primary={true}
        disabled={this.state.requesting}
        label="やりました"
        onClick={() => window.location.replace("/dest/html/options.html")}
      />,
    ];
    const connected = this.state.connected;
    return (
      <Dialog
        title="マストドンインスタンス認証確認"
        modal={true}
        actions={actions}
        open={this.state.showCallbackModal}
      >
        {this.state.requesting ? <CircularProgress /> : null}
        {connected ? (
          <div>
            マストドンインスタンスとの連携に成功しました
            <InstanceView {...connected} />
          </div>
         ) : null}
      </Dialog>
    );
  }
  renderInstanceDialog() {
    const actions = [
      <FlatButton
        label="やっぱやめる"
        onClick={() => this.setState({showInputModal: false})}
      />,
      <FlatButton
        label="認証ページへ移動"
        primary={true}
        disabled={!URL.validate(this.state.input)}
        onClick={() => this.addInstance()}
      />,
    ];
    return (
      <Dialog
        title="インスタンスのURLを入力"
        modal={true}
        actions={actions}
        open={this.state.showInputModal}
      >
        <TextField
          id="mastodon"
          fullWidth={true}
          type="url"
          placeholder="例: https://mstdn.jp"
          value={this.state.input}
          onChange={ev => this.setState({input: ev.target.value})}
        />
      </Dialog>
    );
  }
  addInstance() {
    const url = new URL(this.state.input);
    const m = Mastodon.find(url.host);

    if (m && m.hasAccessToken()) {
      m.toMammutClient().myself().then(myself => m.update({myself}));
      window.alert(`インスタンス ${url.host} はすでに登録されています。`);
      this.setState({input: '', showInputModal: false});
      return;
    }

    const s = new MastodonService(Mastodon);
    s.client(url.host).then(client => {
      Mastodon.fromMammutClient(client).save();
      const authURL = client.authURL({
        scopes: ["read", "write"],
        state: btoa(url.host),
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
    this.setState({showCallbackModal: true, requesting: true});

    let m = Mastodon.find(host);
    if (!m) {
      return this.setState({
        errormsg: `${host}に対応するアプリケーション登録がありません`,
        requesting: false,
      });
    }
    const client = m.toMammutClient();
    client.token(code).then(client => {
      // AccessTokenを持っているので、ここでsaveする。
      m = Mastodon.fromMammutClient(client);
      m.save();
      return client.myself();
    }).then(myself => {
      setTimeout(() => {
        m.update({ myself });
        this.setState({ connected: m, requesting: false });
        // フィードバックは "CallbackModal" に任せる
      }, 2000);
    }).catch(err => {
      console.log("TODO:", err);
      return this.setState({
        errormsg: `${host}に対応するアプリケーション登録がありません`,
        requesting: false,
      });
    })
  }

  static propTypes = {
    styles: PropTypes.object.isRequired,
  }
}