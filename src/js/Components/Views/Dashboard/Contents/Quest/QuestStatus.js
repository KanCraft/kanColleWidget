import React, {Component, PropTypes} from "react";

import {grey300, grey400, orange500, orangeA700, cyan500, cyan800} from "material-ui/styles/colors";

import {YET,NOW,DONE,HIDDEN} from "../../../../Models/Quest";

export default class QuestStatus extends Component {
  style() {
    const styles = {
      base:     {padding:"2px",borderRadius:"2px",color:"white",},
      [YET]:    {color: grey400, border: `thin solid ${grey300}`},
      [NOW]:    {backgroundColor: orange500, textShadow: `0 0 1px ${orangeA700}`},
      [DONE]:   {backgroundColor: cyan500,   textShadow: `0 0 2px ${cyan800}`},
      [HIDDEN]: {},
    };
    return {...styles.base, ...styles[this.props.quest.state]};
  }
  text() {
    switch (this.props.quest.state) {
    case YET:    return "未着手";
    case NOW:    return "遂行中";
    case DONE:   return "達成済";
    case HIDDEN: return "非表示";
    }
  }
  render() {
    return <span style={this.style()}>{this.text()}</span>;
  }
  static propTypes = {
    quest: PropTypes.object.isRequired,
  }
}
