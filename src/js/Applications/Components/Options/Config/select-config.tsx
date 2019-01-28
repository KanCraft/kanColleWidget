import React, { Component } from "react";
import Config from "../../../Models/Config";

// TODO: this.props.configがだるいので、...Configで渡したい
export default class SelectConfig extends Component<{config: Config<any>}> {
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
              <select className="form-select" onChange={ev => this.onChange(ev)}>
                {this.props.config.options.map(opt => {
                  return (
                    <option
                      value={opt.value}
                      key={opt.value}
                      selected={opt.value == this.props.config.value}
                    >{opt.name}</option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
  private onChange(ev) {
    this.props.config.update({value: ev.target.value});
  }
}
