import React, {Component, PropTypes} from "react";
import Toggle       from "material-ui/Toggle";

import Icon from "../../FontAwesome";

import Config from "../../../Models/Config";

const styles = {
    section: {
        marginBottom: "20px"
    },
    inline: {
        marginRight: "20px"
    },
    output: {
        border: "thin dotted #ddd",
        minHeight: "100px",
        fontSize: "2em",
        fontFamily: "monospace",
    }
};

class DebugView extends Component {
    constructor(props) {
        super(props);
        this.debug = Config.find("debug");
        this.state = {
            debug: this.debug.value,
            output: null
        };
    }
    onToggle() {
        this.debug.value = !this.debug.value;
        this.debug.save();
        this.setState({
            debug: this.debug.value
        });
    }
    getContents() {
        if (!this.state.debug) return null;
        return (
      <div>
        <div style={styles.output}>{this.state.output}</div>
      </div>
    );
    }
    setOutput(output) {
        this.setState({output: output});
    }
    getSwitch() {
        return (
          <div>
            <Toggle label={<span><Icon name="terminal" /> DEBUG</span>} labelPosition="right" toggled={this.state.debug} onToggle={this.onToggle.bind(this)}/>
          </div>
        );
    }
    render() {
        return (
          <div>
            <h1 style={this.props.styles.title}>{this.getSwitch()}</h1>
            <div>
              {this.getContents()}
            </div>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired
    }
}
export default DebugView;
