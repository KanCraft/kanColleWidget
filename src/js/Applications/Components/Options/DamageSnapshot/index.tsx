import React, { Component } from "react";

import DamageSnapshotFrame, {DamageSnapshotType} from "../../../Models/DamageSnapshotFrame";
import Config from "../../../Models/Config";
import ConfigView from "../Config";

// TODO: これもうちょいいい方法無いの
//       デコレータ的なやつで
declare interface State {
  damagesnapshot: DamageSnapshotFrame;
  inappdsnapshotsize: Config<number>;
  inappdsnapshotctx: Config<boolean>;
}

export default class DamageSnapshotOptions extends Component<{}, State> {

  constructor(props) {
    super(props);
    this.state = {
      damagesnapshot: DamageSnapshotFrame.get(),
      inappdsnapshotsize: Config.find("inapp-dsnapshot-size"),
      inappdsnapshotctx: Config.find("inapp-dsnapshot-context"),
    }
  }
  render() {
    return (
      <section className="category">
        <h1>大破進撃防止機能</h1>
        <ConfigView config={this.state.damagesnapshot as Config<any>} />
        {this.state.damagesnapshot.value == DamageSnapshotType.InApp ? <ConfigView config={this.state.inappdsnapshotsize} /> : null}
        {this.state.damagesnapshot.value != DamageSnapshotType.Disabled ? <ConfigView config={this.state.inappdsnapshotctx} /> : null}
      </section>
    );
  }
}
