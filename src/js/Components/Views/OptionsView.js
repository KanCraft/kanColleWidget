import React, { Component } from 'react';
import Icon from './FontAwesome';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import WinconfigsView from './Settings/WinconfigsView';

const styles = {
  title: {
    fontSize: '4em'
  }
}

export default class OptionsView extends Component {
  render() {
    return (
      <div>
        <h1 style={styles.title}><Icon name="cog" /> 窓設定</h1>
        <WinconfigsView />
      </div>
    )
  }
}
