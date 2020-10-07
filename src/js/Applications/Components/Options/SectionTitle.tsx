import React from "react";
import ResetButton from "./ResetButton";
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
      <ResetButton models={this.props.models}/>
    );
  }
}