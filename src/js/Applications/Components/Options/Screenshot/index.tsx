import React from "react";
import ScreenshotSetting, { ImageFormat } from "../../../Models/Settings/ScreenshotSetting";
import DownloadService from "../../../../Services/Download";

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
              <h5>編集ページをスキップして保存する</h5>
              <blockquote className="description text-gray">スクショを編集するページをスキップして、バックグラウンドで画像ファイルをダウンロードします。ダウンロードフォルダは、以下の設定に従います。</blockquote>
            </div>
            <div className="column col-auto form-group">
              {/* TODO: on/off系の設定でスイッチのUI、よくつかうっぽいからどっかにまとめたほうがよさそうだな */}
              <label className="form-switch">
                <input type="checkbox"
                  defaultChecked={setting.skipPage}
                  onChange={ev => this.setState({ setting: setting.update({ skipPage: ev.target.checked }) })}
                />
                <i className="form-icon" />
              </label>
            </div>
          </div>

          <div className="columns">
            <div className="column col-6">
              <h5>ダウンロードフォルダ</h5>
              <blockquote className="description text-gray">
                OSで設定されているダウンロード用のフォルダの下のフォルダを指定できます.
                <span className="text-primary c-hand" onClick={() => DownloadService.new().showDefaultFolder()}>それってどこ？</span>
              </blockquote>
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