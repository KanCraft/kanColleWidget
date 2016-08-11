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

import WinconfigsView from './Options/WinconfigsView';

const styles = {
  title: {
    fontSize: '2em'
  }
}

export default class OptionsView extends Component {
  render() {
    return (
      <div>
        <div>
          <h1 style={styles.title}><Icon name="cog" /> Window Configs</h1>
          <WinconfigsView />
        </div>
      </div>
    )
  }
}
