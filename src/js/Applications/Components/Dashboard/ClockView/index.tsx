import React from "react";


export default class ClockView extends React.Component<{
  now: Date;
}> {
  constructor(props) {
    super(props);
  }

  private getDayOfWeek(): string {
    const dict = {
      0: "日",
      1: "月",
      2: "火",
      3: "水",
      4: "木",
      5: "金",
      6: "土",
    };
    return dict[this.props.now.getDay()];
  }

  render() {
    const { now } = this.props;
    return (
      <div className="icon-clock-container row">
        <div className="icon-wrapper">
          <img src="https://cloud.githubusercontent.com/assets/931554/26664134/361ee756-46ca-11e7-98f5-d99e95dd90b8.png" />
        </div>
        <div className="clock-wrapper cell">
          <div className="date-wrapper">
            <div className="month">
              <span>{now.getMonth()}</span>
              <span>月</span>
            </div>
            <div className="date">
              <span>{now.getDate()}</span>
              <span>日</span>
            </div>
            <div className="day-of-week">
              <span>{this.getDayOfWeek()}</span>
              <span>曜日</span>
            </div>
          </div>
          <div className="time-wrapper">
            <div className="hours"><span>{now.getHours().pad(2)}</span></div>
            <div className="colon"><span>:</span></div>
            <div className="minute"><span>{now.getMinutes().pad(2)}</span></div>
          </div>
        </div>
      </div>
    );
  }
}