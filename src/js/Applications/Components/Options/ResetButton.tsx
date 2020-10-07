import React from "react";
import { Model } from "chomex";

export default class SectionTitle extends React.Component<{
  models: (typeof Model)[];
}> {
  render() {
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