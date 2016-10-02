import React, {Component} from 'react';

class Row extends Component {
  render() {
    return (
      <div style={{display: 'flex'}}>
        {this.props.children}
      </div>
    )
  }
}
class Col extends Component {
  render() {
    return (
      <div style={{flex: 1}}>
        {this.props.children}
      </div>
    )
  }
}

export {
  Row, Col
}
