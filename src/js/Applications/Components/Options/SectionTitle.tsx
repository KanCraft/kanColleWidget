import React from "react";
import { Model } from "chomex";

export default class SectionTitle extends React.Component<{
  children: string;
  models?: (typeof Model)[];
}> {
  render() {
    return (
      <h1>{this.props.children} {this.renderResetButton()}</h1>
    );
  }
  private renderResetButton() {
    if (this.props.models.length == 0) return null;
    return (
      <button className="reset-button btn btn-link btn-sm" onClick={() => this.onClickResetButton()}>初期設定に戻す</button>
    );
  }
  private onClickResetButton() {
    const ok = window.confirm("このセクションの設定を初期状態に戻しますか？");
    if (!ok) return;
    this.props.models.map(m => m.drop());
    window.location.reload();
  }
}