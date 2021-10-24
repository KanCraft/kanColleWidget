import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup , TwitterAuthProvider } from "firebase/auth";
import TwitterSetting from "../../../Models/Settings/TwitterSetting";
declare const FIREBASE_CONFIG: any;
const app = initializeApp(FIREBASE_CONFIG);

export default class TwitterAccountSettingView extends React.Component<{}, {
  setting: TwitterSetting,
}> {
  constructor(props) {
    super(props);
    this.state = {
      setting: TwitterSetting.user(),
    };
  }
  render() {
    const { setting } = this.state;
    return (
      <section className="category twitter-account-setting">
        <h1>Twitter連携設定</h1>
        <div className="container">

          <div className="columns">
            <div className="column col-6">
              <h5>Twitterアカウントを連携させる</h5>
            </div>
            <div className="column col-auto">
              <label className="form-switch">
                <input type="checkbox"
                  defaultChecked={setting.authorized}
                  onChange={ev => this.onSwitchAuthentication(ev)}
                />
                <i className="form-icon" />
              </label>
            </div>
            <div className="column col-3">
              {setting.authorized ? <figure className="avatar avatar-lg">
                <a href={`https://twitter.com/${setting.screenName}`}>
                  <img src={setting.profileImageUrlHttps} alt={setting.screenName} />
                </a>
              </figure> : null}
            </div>
          </div>

          <div className="columns">
            <div className="column col-6">
              <h5>ポップアップに運営電文を表示する</h5>
              <blockquote className="description text-gray">右上のアイコンを押したときに出るポップアップに、公式ツイッターアカウントの直近ツイートを表示します</blockquote>
            </div>
            <div className="column col-auto">
              <label className="form-switch">
                <input type="checkbox"
                  disabled={!setting.authorized}
                  defaultChecked={setting.authorized && setting.displayOfficialTwitter}
                  onChange={ev => this.onSwitchOfficialTwitter(ev)}
                />
                <i className="form-icon" />
              </label>
            </div>
          </div>

        </div>
      </section>
    );
  }
  private async onSwitchAuthentication(ev: React.ChangeEvent<HTMLInputElement>) {
    const { setting } = this.state;
    const provider = new TwitterAuthProvider();
    const auth = getAuth(app);
    if (ev.currentTarget.checked) {
      const userCred = await signInWithPopup(auth, provider);
      const oauthCred = TwitterAuthProvider.credentialFromResult(userCred);
      this.setState({ setting: setting.success(userCred, oauthCred) });
    } else {
      await auth.signOut();
      this.setState({ setting: setting.revoke() });
    }
  }
  private onSwitchOfficialTwitter(ev: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ setting: this.state.setting.update({ displayOfficialTwitter: ev.currentTarget.checked }) });
  }
}