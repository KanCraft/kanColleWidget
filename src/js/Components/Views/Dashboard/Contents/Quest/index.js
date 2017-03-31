import React, {Component, PropTypes} from "react";

import QuestView       from "./QuestView";
import AchievementView from "./AchievementView";

export default class DashboardQuest extends Component {
  render() {
    return (
      <div style={{...this.props.style}}>
        <div style={{display:"flex"}}>
          <div style={{flex:"2"}}>
            <QuestView />
          </div>
          <div style={{flex:"1"}}>
            <AchievementView />
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    style: PropTypes.object.isRequired,
  }
}
