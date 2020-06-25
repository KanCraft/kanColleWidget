import React, { createRef } from "react";
import cn from "classnames";
import Setting from "../../../Models/Settings/NotificationSetting";
import FileService from "../../../../Services/Files";
import NotificationService from "../../../../Services/Notification";

class NotificationSettingView extends React.Component<{
  label: string,
  kind: string,
}, {
  setting: Setting,
}> {
  constructor(props) {
    super(props);
    this.state = {
      setting: Setting.find<Setting>(this.props.kind),
    };
  }
  render() {
    const { setting } = this.state;
    return (
      <div className={`container notification-kind-setting ${this.props.kind}`}>
        <div className="columns">
          <div className="column col-3 kind-label">
            <div>{this.props.label}</div>
          </div>
          <div className="column col-1">{this.renderEnabledSwitchView(setting)}</div>
          <div className="column col-2">{this.renderIconChangerView(setting)}</div> 
          <div className="column">{this.renderSoundChangerView(setting)}</div>
          <div className="column col-1">{this.renderTesterView(setting)}</div>
        </div>
      </div>
    );
  }

  // MARK: - Enabled設定用
  renderEnabledSwitchView(setting: Setting) {
    if (this.props.kind == "default") return null; // defaultはいじれんようにしよ
    return (
      <div className="form-group">
        <label className="form-switch">
          <input type="checkbox"
            defaultChecked={setting.enabled}
            onChange={(ev) => this.setState({ setting: setting.update({ enabled: ev.target.checked }) })}
          /><i className="form-icon"></i>
        </label>
      </div>
    );
  }

  // MARK: - Icon設定用メソッド
  renderIconChangerView(setting: Setting) {
    if (setting.icon) return (
      <div className="icon-preview"
        style={{ backgroundImage: `url(${setting.icon})` }}
        onClick={() => window.confirm(`${this.props.label}のアイコンを削除？`) ? this.onIconFileDelete() : null}
      />
    );
    const ref = createRef<HTMLInputElement>();
    return (
      <div>
        <button className={cn("btn", { disabled: !setting.enabled })} onClick={() => ref.current.click()}>アイコン</button>
        <input type="file" hidden accept="image/*" ref={ref} onChange={ev => this.onIconFileChange(ev)} />
      </div>
    );
  }
  async onIconFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    if (ev.target.files.length == 0) return; // TODO: 既存のファイルを消す
    const { setting } = this.state;
    const file = ev.target.files[0];
    const fs = new FileService();
    await fs.init();
    const icon = await fs.save(setting.getFileSystemIconPath(), file);
    this.setState({ setting: this.state.setting.update({ icon }) });
  }
  async onIconFileDelete() {
    const { setting } = this.state;
    const fs = new FileService();
    await fs.init();
    await fs.delete(setting.getFileSystemIconPath(), false);
    this.setState({ setting: this.state.setting.update({ icon: undefined }) });
  }

  // MARK: - Sound設定用メソッド
  renderSoundChangerView(setting: Setting) {
    if (setting.sound) return (
      <div className="sound-preview">
        <audio src={setting.sound} controls={true} />
        <i className="icon icon-cross"
          onClick={() => window.confirm(`${this.props.label}の通知音を削除？`) ? this.onSoundFileDelete() : null}
        />
      </div>
    );
    const ref = createRef<HTMLInputElement>();
    return (
      <div>
        <button className={cn("btn", { disabled: !setting.enabled })} onClick={() => ref.current.click()}>通知音</button>
        <input type="file" hidden accept="audio/*" ref={ref} onChange={ev => this.onSoundFileChange(ev)} />
      </div>
    );
  }
  async onSoundFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    if (ev.target.files.length == 0) return; // TODO: 既存のファイルを消す
    const file = ev.target.files[0];
    const fs = new FileService();
    await fs.init();
    const sound = await fs.save(this.state.setting.getFileSystemSoundPath(), file);
    this.setState({ setting: this.state.setting.update({ sound }) });
  }
  async onSoundFileDelete() {
    const { setting } = this.state;
    const fs = new FileService();
    await fs.init();
    await fs.delete(setting.getFileSystemSoundPath(), false);
    this.setState({ setting: this.state.setting.update({ sound: undefined }) });
  }

  // MARK: - テスト通知用
  renderTesterView(setting: Setting) {
    return <button
      className="btn btn-link"
      onClick={() => {
        const ns = new NotificationService();
        const opt = setting.toChromeOptions({title: "テスト", message: `${this.props.label}通知のテスト`});
        const sound = setting.getSound();
        ns.create(`test_${this.props.kind}_${Date.now()}`, opt, sound);
      }}
    >TEST</button>;
  }
}

export default class NotificationSettings extends React.Component {
  render() {
    return (
      <section className="category notification-setting">
        <h1>通知設定</h1>
        <NotificationSettingView label="デフォルト" kind="default" />
        <NotificationSettingView label="遠征" kind="mission" />
        <NotificationSettingView label="修復" kind="recovery" />
        <NotificationSettingView label="建造" kind="shipbuilding" />
      </section>
    );
  }
}