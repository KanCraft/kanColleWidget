import React, {Component} from "react";
import PropTypes from "prop-types";

import Avatar      from "material-ui/Avatar";
import PhotoCamera from "material-ui/svg-icons/image/photo-camera";
import {grey200}   from "material-ui/styles/colors";

import ClockRow     from "./ClockRow";
import SchedulesRow from "./SchedulesRow";
import TirednessRow from "./TirednessRow";
import Config       from "../../../../Models/Config";
import Assets       from "../../../../../Services/Assets";

import {Client} from "chomex";

export default class DashboardClock extends Component {
  constructor(props) {
    super(props);
    this.client = new Client(chrome.runtime);
    this.assets = new Assets(Config);
  }
  render() {
    return (
      <div style={{...this.props.style}}>
        <ClockRow avatar={this.getAvatar()}/>
        <SchedulesRow />
        <TirednessRow />
      </div>
    );
  }
  getAvatar() {
    const style = {
      cursor: "pointer",
      width: "80px",
      height: "80px",
      margin: "0 auto",
      backgroundColor: grey200
    };
    let icon = this.assets.getNotificationIcon("default", false);
    if (icon) {
      return <Avatar src={icon} style={style} onClick={this.onClickAvatar.bind(this)} />;
    }
    return <Avatar icon={<PhotoCamera />} style={style} onClick={this.onClickAvatar.bind(this)}/>;
  }
  onClickAvatar() {
    this.client.message("/window/current-action");
  }
  static propTypes = {
    style: PropTypes.object.isRequired,
  }
}
