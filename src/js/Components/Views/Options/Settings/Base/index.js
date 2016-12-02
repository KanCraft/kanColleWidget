import React, {Component, PropTypes} from "react";

export class SettingText extends Component {
    render() {
        return (
          <div>
            <h1>{this.props.foo}</h1>
          </div>
        );
    }
    static propTypes = {
        foo: PropTypes.any
    }
}
