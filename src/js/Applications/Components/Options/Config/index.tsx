import React, { Component } from "react";
import Config, {Type as ConfigType} from "../../../Models/Config";

import SwitchConfig from "./switch-config";
import SelectConfig from "./select-config";
import NumberConfig from "./number-config";

export default class ConfigView extends Component<{config: Config<any>}, {}> {
  render() {
    return (
      <div className="columns">
        {this._renderContent()}
      </div>
    );
  }
  _renderContent() {
    switch (this.props.config.type) {
    case ConfigType.Switch:
      return <SwitchConfig config={this.props.config} />;
    case ConfigType.Select:
      return <SelectConfig config={this.props.config} />;
    case ConfigType.Number:
      return <NumberConfig config={this.props.config} />;
    default:
      return null;
    }
  }
}
