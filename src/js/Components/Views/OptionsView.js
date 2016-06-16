import React, { Component } from 'react';
import Icon from './FontAwesome';

const styles = {
  title: {
    fontSize: '4em'
  }
}

export default class OptionsView extends Component {
  render() {
    return (
      <div>
        <h1 style={styles.title}><Icon name="cog" /> 設定</h1>
      </div>
    )
  }
}
