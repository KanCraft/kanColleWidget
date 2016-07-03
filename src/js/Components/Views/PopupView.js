import React, { Component } from 'react';
import { Client } from 'chomex';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

const url = "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/";

const ENTER = 13;
const client = new Client(chrome.runtime);

const DefaultWhiteWindow = {
  id: '__white',
  alias: "WHITE (default size)",
  url: url,
  decoration: 'FRAME_SHIFT',
  size: {width: 800, height: 480}
};

export default class PopupView extends Component {

  constructor() {
    super();
    // this.history = new History();
    this.state = {
      winconfigs: [],
      selected: '__white',
    };

    client.message({act: '/config/get', key: 'winconfigs'}, true).then(res => {
      res.data.value.push(DefaultWhiteWindow);
      this.setState({winconfigs: res.data.value});
    });
    client.message({act: '/config/set', key: 'hoge'}).then(res => {
      console.log('/config/set ok', res);
    });
  }

  componentDidMount() {
    // お、いきなりwindowを参照しましたね！
    window.document.addEventListener('keydown', (ev) => {
      if (ev.which != ENTER) return;
      client.message({act: '/window/open', win: this.state.winconfigs[this.state.selected]})
        .then(res => console.log('エンターキーのやつ', res));
    })
  }

  handleChange(ev, index, selected) {
    this.setState({selected});
    const win = this.state.winconfigs.find(win => { return win.id == selected; });
    client.message({act: '/window/open', win}, true)
      .then(res => console.log('/window/open, ok', res))
      .catch(err => console.log('/window/open, ng', err));
  }

  render() {

    const winconfigs = this.state.winconfigs.map(win => {
      return <MenuItem key={win.id} value={win.id} primaryText={win.alias} />;
    });

    return (
      <div>
        <SelectField value={this.state.selected} onChange={this.handleChange.bind(this)}>
          {winconfigs}
        </SelectField>
        <FlatButton label="詳細設定" onClick={() => {
            // TODO: とりあえずwindow.openでいいや
            window.open('/dest/html/options.html');
          }} />
      </div>
    );
  }
}
