import React, {Component, PropTypes} from "react";
import Toggle       from "material-ui/Toggle";
import RaisedButton from "material-ui/RaisedButton";
import SelectField  from "material-ui/SelectField";
import MenuItem     from "material-ui/MenuItem";

import Icon from "../../FontAwesome";

import Config from "../../../Models/Config";
import {Client} from "chomex";

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

class ImgDiffDebugView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purpose: "createship",
            index:    1,
        };
    }
    onPurposeChanged(ev, index, purpose) {
        this.setState({ purpose });
    }
    onDockChanged(ev, index) {
        this.setState({index:index+1});
    }
    execute() {
        const client = new Client(chrome.runtime, true);
        client.message("/debug/imagerecognize", {
            purpose: this.state.purpose,
            index: this.state.index,
        }).catch(err => {
            console.log(err);
        });
    }
    render() {
        return (
          <div style={styles.section}>
            <SelectField value={this.state.purpose} onChange={this.onPurposeChanged.bind(this)}>
              <MenuItem value="recovery"   primaryText="修復画面" />
              <MenuItem value="createship" primaryText="建造画面" />
            </SelectField>
            <SelectField value={this.state.index} onChange={this.onDockChanged.bind(this)}>
              <MenuItem value={1} primaryText="第一ドック" />
              <MenuItem value={2} primaryText="第二ドック" />
              <MenuItem value={3} primaryText="第三ドック" />
              <MenuItem value={4} primaryText="第四ドック" />
            </SelectField>
            <RaisedButton style={styles.inline} secondary={true} label={"画像認識"} onClick={this.execute.bind(this)} />
          </div>
        );
    }
    static propTypes = {
        output: PropTypes.func
    }
}

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
              <ImgDiffDebugView output={this.setOutput.bind(this)}/>
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
