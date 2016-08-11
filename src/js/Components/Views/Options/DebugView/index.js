import React, {Component} from 'react';
import Toggle from 'material-ui/Toggle';
import Config from '../../../Models/Config';

class DebugView extends Component {
  constructor(props) {
    super(props);
    this.debug = Config.find('debug');
    this.state = {
      debug: this.debug.value
    };
  }
  onToggle() {
    this.debug.value = !this.debug.value;
    this.debug.save();
    this.setState({
      debug: this.debug.value
    });
  }
  render() {
    return (
      <div>
        <Toggle label='Debug' labelPosition='right' toggled={this.state.debug} onToggle={this.onToggle.bind(this)}/>
      </div>
    )
  }
}
export default DebugView;
