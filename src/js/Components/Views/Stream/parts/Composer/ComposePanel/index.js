import React, {Component} from "react";
import PropTypes from "prop-types";

import Slider, { Range, Handle } from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";


import Row from "../../Row";

export default class ComposePanel extends Component {
  render() {
    return (
      <div>
        <h2>区間</h2>
        <Row>
          <Range
            disabled={this.props.duration == 0}
            min={0} max={100}
            defaultValue={[0, 100]}
            pushable={8}
            handle={this.handleDurationRangeChange.bind(this)}
            onChange={([start, end]) => this.props.changeDuration(this.props.duration * start / 100, this.props.duration * end / 100)}
          />
        </Row>
        <h2>倍速</h2>
        <Row>
          <Slider
            min={-2} max={2}
            step={1} defaultValue={0}
            handle={this.handleSpeedSliderChange.bind(this)}
            onChange={speed => this.props.changeSpeed(Math.pow(2, speed))}
          />
        </Row>
      </div>
    );
  }
  handleDurationRangeChange(props) {
    const {value, dragging, index, ...restProps} = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={Math.floor(this.props.duration * value)/100 + "秒"}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  }
  handleSpeedSliderChange(props) {
    const {value, dragging, index, ...restProps} = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={Math.pow(2, value) + "倍"}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  }
  static propTypes = {
    duration:       PropTypes.number.isRequired,
    changeSpeed:    PropTypes.func.isRequired,
    changeDuration: PropTypes.func.isRequired,
  }
}
