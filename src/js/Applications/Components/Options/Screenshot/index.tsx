import React from "react";
import ScreenshotSetting, { ImageFormat } from "../../../Models/Settings/ScreenshotSetting";

export default class ScrenshotSettingView extends React.Component<{}, {
  setting: ScreenshotSetting,
}> {
  constructor(props) {
    super(props);
    this.state = {
      setting: ScreenshotSetting.user(),
    };
  }
  render() {
    const { setting } = this.state;
    return (
      <section className="category screenshot-setting">
        <h1>スクショ設定</h1>
        <div className="container">

          <div className="columns">
            <div className="column col-6">
              <h5>ダウンロードフォルダ</h5>
              <blockquote className="description text-gray">OSのデフォルトの「ダウンロード」フォルダの下のフォルダを指定できます</blockquote>
            </div>
            <div className="column col-auto">
              <input type="text" className="form-input"
                defaultValue={setting.folder}
                onChange={ev => this.onChangeFolder(ev)}
                placeholder="艦これウィジェット"
              />
            </div>
          </div>

          <div className="columns">
            <div className="column col-6">
              <h5>ダウンロードファイル名</h5>
              <blockquote className="description text-gray">yyyyMMdd_HHmmss 的なやつが使えます</blockquote>
            </div>
            <div className="column">
              <div className="input-group">
                <input type="text" className="form-input"
                  defaultValue={setting.filename}
                  onChange={ev => this.onChangeFilename(ev)}
                  placeholder="スクリーンショット_yyyyMMdd_HHmmss"
                />
                <select className="form-select" defaultValue={setting.format} onChange={ev => this.onChangeFormat(ev)}>
                  <option value={ImageFormat.PNG}>.png</option>
                  <option value={ImageFormat.JPEG}>.jpeg</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  }
  onChangeFolder(ev: React.ChangeEvent<HTMLInputElement>) {
    // TODO: バリデーション
    this.setState({
      setting: this.state.setting.update({
        folder: ev.target.value,
      }),
    });
  }
  onChangeFilename(ev: React.ChangeEvent<HTMLInputElement>) {
    // TODO: バリデーション
    this.setState({
      setting: this.state.setting.update({
        filename: ev.target.value,
      }),
    });
  }
  onChangeFormat(ev: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      setting: this.state.setting.update({
        format: ev.target.value,
      }),
    });
  }
}