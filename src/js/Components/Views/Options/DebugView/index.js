import React, {Component} from 'react';
import Toggle       from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField  from 'material-ui/SelectField';
import MenuItem     from 'material-ui/MenuItem';

import Config from '../../../Models/Config';
import ImageRecognizationService from '../../../Services/ImageRecognizationService';

const styles = {
  section: {
    marginBottom: '20px'
  },
  inline: {
    marginRight: '20px'
  },
  output: {
    border: 'thin dotted #ddd',
    minHeight: '100px',
    fontSize: '2em',
    fontFamily: 'monospace',
  }
}

class ImgDiffDebugView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purpose: 'createship',
      dock:    1,
    }
    this.imageRecognization = new ImageRecognizationService();
  }
  onPurposeChanged(ev, index, purpose) {
    this.setState({ purpose });
  }
  onDockChanged(ev, index, dock) {
    this.setState({ dock });
  }
  execute() {
    this.imageRecognization.test(this.state).then(nums => {
      this.props.output(`${nums[0]}${nums[1]}:${nums[2]}${nums[3]}`);
    });
  }
  render() {
    return (
      <div style={styles.section}>
        <SelectField value={this.state.purpose} onChange={this.onPurposeChanged.bind(this)}>
          <MenuItem value='recovery'   primaryText='修復画面' />
          <MenuItem value='createship' primaryText='建造画面' />
        </SelectField>
        <SelectField value={this.state.dock} onChange={this.onDockChanged.bind(this)}>
          <MenuItem value={1} primaryText='第一ドック' />
          <MenuItem value={2} primaryText='第二ドック' />
          <MenuItem value={3} primaryText='第三ドック' />
          <MenuItem value={4} primaryText='第四ドック' />
        </SelectField>
        <RaisedButton style={styles.inline} secondary={true} label={'画像認識'} onClick={this.execute.bind(this)} />
      </div>
    )
  }
}

class DebugView extends Component {
  constructor(props) {
    super(props);
    this.debug = Config.find('debug');
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
  render() {
    return (
      <div>
        <ImgDiffDebugView output={this.setOutput.bind(this)}/>
        <div style={styles.section}>
          <Toggle label='Debug' labelPosition='right' toggled={this.state.debug} onToggle={this.onToggle.bind(this)}/>
        </div>
        {this.getContents()}
      </div>
    )
  }
}
export default DebugView;
