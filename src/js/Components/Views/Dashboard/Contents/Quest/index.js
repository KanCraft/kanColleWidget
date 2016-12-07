import React, {Component, PropTypes} from "react";

export default class DashboardQuest extends Component {
    render() {
        return (
          <div style={{...this.props.style}}>
            <span>任務進捗建設予定地</span>
          </div>
        );
    }
    static propTypes = {
        style: PropTypes.object.isRequired,
    }
}
