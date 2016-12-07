import React, {Component,PropTypes} from "react";

import Avatar      from "material-ui/Avatar";
import PhotoCamera from "material-ui/svg-icons/image/photo-camera";
import {grey200}   from "material-ui/styles/colors";

import ClockRow     from "./ClockRow";
import SchedulesRow from "./SchedulesRow";
import TirednessRow from "./TirednessRow";

import {Client} from "chomex";

export default class DashboardClock extends Component {
    constructor(props) {
        super(props);
        this.client = new Client(chrome.runtime);
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
        return <Avatar icon={<PhotoCamera />} style={style} onClick={this.onClickAvatar.bind(this)}/>;
    }
    onClickAvatar() {
        this.client.message("/window/current-action");
    }
    static propTypes = {
        style: PropTypes.object.isRequired,
    }
}
