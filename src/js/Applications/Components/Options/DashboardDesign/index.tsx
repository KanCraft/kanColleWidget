import React from "react";
import TimerDisplaySetting, { DisplayFormat } from "../../../Models/Settings/TimerDisplaySetting";

class TimerDisplaySettingView extends React.Component<{}, { setting: TimerDisplaySetting }> {
  constructor(props) {
    super(props);
    this.state = { setting: TimerDisplaySetting.user() };
  }
  render() {
    const { setting } = this.state;
    return (
      <div className={"container"}>
        <div className="columns">
          <div className="column col-6">
            <h5>タイマー時間表示</h5>
            <blockquote className="description text-gray">タイマーの通知がくるまでの時間をどう表示するか選べます。</blockquote>
          </div>
          <div className="column col-auto">
            <select className="form-select" defaultValue={setting.format}
              onChange={ev => this.setState({ setting: setting.update({ format: ev.target.value }) })}
            >
              <option value={DisplayFormat.ScheduledTime}>予定時刻を表示</option>
              <option value={DisplayFormat.RemainingTIme}>残り時間を表示</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default class DashboardDesignView extends React.Component {
  render() {
    return (
      <section className="category notification-setting">
        <h1>ダッシュボード設定</h1>
        <TimerDisplaySettingView />
      </section>
    );
  }
}