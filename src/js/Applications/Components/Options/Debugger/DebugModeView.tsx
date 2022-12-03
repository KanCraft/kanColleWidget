import React from "react";
import DebugSetting from "../../../Models/Settings/DebugSetting";

export default class DebugModeView extends React.Component<{}, {
  setting: DebugSetting,
}> {
  constructor(props) {
    super(props);
    this.state = { setting: DebugSetting.user() };
  }
  render() {
    const { setting } = this.state;
    return (
      <section>
        <div className="container">
          <div className="columns">
            <div className="column col-6">
              <h5>デバッグモード</h5>
              <blockquote className="description">
                1. OCRのために撮った画像をひらく.
              </blockquote>
            </div>
            <div className="column form-group">
              <label className="form-switch">
                <input type="checkbox"
                  defaultChecked={setting.on}
                  onChange={ev => this.setState({ setting: setting.update({ on: ev.target.checked }) })}
                />
                <i className="form-icon" />
              </label>
            </div>
          </div>
          <div className="columns">
            <div className="column col-6">
              <h5>OCRサーバ</h5>
              <blockquote className="description text-gray">
                OCRサーバを変更します.
              </blockquote>
            </div>
            <div className="column">
              <input type="text" className="form-input"
                     defaultValue={setting.ocrServerUrl}
                     onChange={ev => this.setState({
                       setting: setting.update({ ocrServerUrl: ev.target.value })
                     })}
                     placeholder="未指定(デフォルトサーバ)"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
