import React, { Component } from "react";

import SortieContextSetting, { SortieContextType } from "../../../Models/Settings/SortieContextSetting";
import DamageSnapshotSetting, { DamageSnapshotType } from "../../../Models/Settings/DamageSnapshotSetting";

export default class DamageSnapshotSettingView extends Component<{}, {
  dssetting: DamageSnapshotSetting,
  ctxsetting: SortieContextSetting,
}> {
  constructor(props) {
    super(props);
    this.state = {
      dssetting: DamageSnapshotSetting.user(),
      ctxsetting: SortieContextSetting.user()
    };
  }
  render() {
    const { dssetting, ctxsetting } = this.state;
    return (
      <section className="category">
        <h1>大破進撃防止機能</h1>
        <div className="container">
          <div className="columns">
            <div className="column col-6">
              <h5>大破進撃防止窓の表示</h5>
              <blockquote className="description text-gray">戦闘終了時の艦隊状況を撮影し、次の戦闘開始時まで表示し続けます。窓内表示を選択した場合、表示された艦隊状況はマウスオーバーで非表示にできます</blockquote>
            </div>
            <div className="column col-auto">
              <select className="form-select" defaultValue={dssetting.type}
                onChange={ev => this.setState({ dssetting: dssetting.update({ type: ev.target.value }) })}
              >
                <option value={DamageSnapshotType.Disabled}>使用しない</option>
                <option value={DamageSnapshotType.InApp}>ゲーム内表示</option>
                <option value={DamageSnapshotType.Separate}>別窓表示</option>
              </select>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="columns">
            <div className="column col-6">
              <h5>進撃中海域情報の表示</h5>
              <blockquote className="description text-gray">大破進撃防止表示内に「今何戦目」みたいなテキストを含める</blockquote>
            </div>
            <div className="column col-auto">
              <select className="form-select" defaultValue={ctxsetting.type}
                onChange={ev => this.setState({ ctxsetting: ctxsetting.update({ type: ev.target.value }) })}
              >
                <option value={SortieContextType.Disabled}>使用しない</option>
                <option value={SortieContextType.Full}>海域名表示（例: 沖ノ島沖）</option>
                <option value={SortieContextType.Short}>省略表示（例: 2-5）</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
