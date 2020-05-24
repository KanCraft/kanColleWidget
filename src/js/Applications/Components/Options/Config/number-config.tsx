import React, { Component } from "react";

import Config from "../../../Models/Config";

export default class NumberConfig extends Component<{config: Config<number>}> {
  render() {
    return (
      <div className="column col-10">
        <div className="tile">
          <div className="tile-content">
            <h5 className="tile-title">{this.props.config.title}</h5>
            <p className="tile-subtitle text-gray">{this.props.config.description}</p>
          </div>
          <div className="tile-action">
            <div className="form-group">
              <input
                onChange={(ev) => this.onChange(ev)}
                className="form-input"
                type="number"
                value={this.props.config.value}
                step={this.props.config.step}
                min={this.props.config.range[0]}
                max={this.props.config.range[1]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  private onChange(ev: {target: HTMLInputElement}) {
    this.props.config.update({value: parseInt(ev.target.value)});
  }
}
