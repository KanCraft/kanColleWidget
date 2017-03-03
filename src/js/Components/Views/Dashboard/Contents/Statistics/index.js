import React, {Component,PropTypes} from "react";

export default class DashboardStatistics extends Component {
  render() {
    return (
      <div style={{...this.props.style}}>
        <span>資源推移表建設予定地</span>
      </div>
    );
  }
  static propTypes = {
    style: PropTypes.object.isRequired,
  }
}
