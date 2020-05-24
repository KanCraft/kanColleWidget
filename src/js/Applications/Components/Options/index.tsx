import React, { Component } from "react";

import DamageSnapshot from "./DamageSnapshot";
import CategorySection from "./Config/CategorySection";
import Debugger from "./Debugger";

import Config from "../../Models/Config";

// webpack.config.jsの、DefinePluginを参照
declare let NODE_ENV;

export default class OptionsPage extends Component<{}, {dictionary: any}> {
  constructor(props) {
    super(props);
    const dictionary = {};
    Config.list<Config<any>>().map(c => {
      if (dictionary[c.category] instanceof Array == false) {
        dictionary[c.category] = [];  
      }
      dictionary[c.category].push(c);
    });
    this.state = {dictionary};
  }

  render() {
    return (
      <div className="container options">
        <DamageSnapshot />
        <CategorySection title="ゲーム内の便利ボタン" configs={this.state.dictionary["inapp"]} />
        <CategorySection title="通知設定"           configs={this.state.dictionary["notification"]} />
        {this.isDev() ? <Debugger /> : null}
      </div>
    );
  }
  private isDev(): boolean {
    return NODE_ENV !== "production";
  }
}