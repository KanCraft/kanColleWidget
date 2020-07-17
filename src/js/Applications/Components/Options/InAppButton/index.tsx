import React from "react";
import InAppButtonSetting from "../../../Models/Settings/InAppButtonSetting";

export default class InAppButtonSettingView extends React.Component<{}, {
  setting: InAppButtonSetting,
}> {
  constructor(props) {
    super(props);
    this.state = {
      setting: InAppButtonSetting.user(),
    };
  }
  render() {
    const { setting } = this.state;
    return (
      <section className="category inapp-button-setting">
        <h1>ゲーム内の便利ボタン</h1>
        <div className="container">
          <div className="columns">
            <div className="column col-6">
              <h5>ゲーム画面ミュートボタンを表示する</h5>
              <blockquote className="description text-gray">
                ゲーム画面に一発ミュート/ミュート解除できるボタンを表示します
              </blockquote>
            </div>
            <div className="column form-group">
              <label className="form-switch">
                <input type="checkbox"
                  defaultChecked={setting.mute}
                  onChange={ev => this.setState({ setting: setting.update({ mute: ev.target.checked }) })}
                />
                <i className="form-icon" />
              </label>
            </div>
          </div>
          <div className="columns">
            <div className="column col-6">
              <h5>ゲーム画面スクショボタンを表示する</h5>
              <blockquote className="description text-gray">
                ゲーム画面に一発でスクショできるボタンを表示します
              </blockquote>
            </div>
            <div className="column form-group">
              <label className="form-switch">
                <input type="checkbox"
                  defaultChecked={setting.screenshot}
                  onChange={ev => this.setState({ setting: setting.update({ screenshot: ev.target.checked })})}
                />
                <i className="form-icon" />
              </label>
            </div>
          </div>
        </div>
      </section>
    );
  }
}