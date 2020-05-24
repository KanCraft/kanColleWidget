import React, { Component } from "react";

import Config from "../../../Models/Config";

export default class SwitchConfig extends Component<{ config: Config<any> }, { timestamp: number }> {
  private onChange(ev) {
    this.props.config.update({value: ev.target.checked});
    this.setState({ timestamp: Date.now() });
  }
  render() {
    const {
      config
    } = this.props;
    return (
      <div className="column col-10">
        <div className="tile">
          <div className="tile-content">
            <h5 className="tile-title">{config.title}</h5>
            <p className="tile-subtitle text-gray">{config.description}</p>
          </div>
          <div className="tile-action">
            <div className="form-group">
              <label className="form-switch">
                <input type="checkbox" checked={config.value} onChange={ev => this.onChange(ev)} />
                <i className="form-icon" />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
