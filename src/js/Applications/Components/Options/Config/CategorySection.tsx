import React, { Component } from "react";
import Config from "../../../Models/Config";
import ConfigView from "./index";

// とくに相互依存が無くて表示ロジックが凝っていない設定カテゴリはこのコンポーネントを使ってください
export default class CategorySection extends Component<{title: string; configs: Config<any>[]}> {
  render() {
    const {title, configs} = this.props;
    return (
      <section className="category">
        <h1>{title}</h1>
        {configs.map(config => <ConfigView key={config._id} config={config} />)}
      </section>
    );
  }
}
