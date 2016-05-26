import React, { Component } from 'react';
import { Client } from 'chomex';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import History from '../Models/History';

const ENTER = 13;
const client = new Client(chrome.runtime);

export default class PopupView extends Component {

  constructor() {
    super();
    this.history = new History();
    this.selectedWinConfig = 2; // History.get('winconfig')
    client.message({act: '/history/get'}).then(res => {
      console.log('メッセンジャーOK?', res);
      debugger;
      alert('/history/get\nOK')
    }).catch(err => {
      console.log('メッセンジャーNG!', err);
      alert('/history/get\nNG')
    })
  }

  componentDidMount() {
    // お、いきなりwindowを参照しましたね！
    window.document.addEventListener('keydown', (ev) => {
      if (ev.which == ENTER) console.log(this.selectedWinConfig);
    })
  }

  handleChange(ev, index, value) {
    alert(`${index}\n${value}`);
  }

  render() {
    return (
      <div>
        <SelectField value={this.selectedWinConfig} onChange={this.handleChange} ref="foo">
          <MenuItem value={1} primaryText="Never" />
          <MenuItem value={2} primaryText="Every Night" />
          <MenuItem value={3} primaryText="Weeknights" />
          <MenuItem value={4} primaryText="Weekends" />
          <MenuItem value={5} primaryText="Weekly" />
        </SelectField>
      </div>
    );
  }
}
