import React, { Component } from 'react';
import { Client } from 'chomex';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import History from '../Models/History';

const ENTER = 13;
const client = new Client(chrome.runtime);

export default class PopupView extends Component {

  constructor() {
    super();
    this.history = new History();
    this.state = {
      winconfigs: {},
      selected: '__white',
    };

    client.message({act: '/config/get', key: 'winconfig'}, true).then(res => {
      this.setState({winconfigs: res.data});
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
    client.message({act: '/window/open', win: this.state.winconfigs[selected]}, true)
      .then(res => console.log('/window/open, ok', res))
      .catch(err => console.log('/window/open, ng', err));
  }

  render() {

    const winconfigs = Object.keys(this.state.winconfigs).map(id => {
      const win = this.state.winconfigs[id];
      return <MenuItem key={id} value={id} primaryText={win.alias} />;
    });

    return (
      <div>
        <SelectField value={this.state.selected} onChange={this.handleChange.bind(this)}>
          {winconfigs}
        </SelectField>
        <FlatButton label="詳細設定" />
      </div>
    );
  }
}
