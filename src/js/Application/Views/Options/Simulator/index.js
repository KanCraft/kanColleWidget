import React, {Component} from "react";
import {Client} from "chomex";

import BugReport from "material-ui/svg-icons/action/bug-report";

export default class SimulatorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kind:       "request",
      // controller: "onCombinedBattleResulted",
      controller: "onDeck",
      params:     {__this:{}},
      raw:        JSON.stringify({__this:{}}, null, 2),
      error:      null,
      output:     "",
    };
    this.client = new Client(chrome.runtime);
  }
  onParamsChanged(ev) {
    try {
      const params = JSON.parse(ev.target.value);
      this.setState({
        raw: ev.target.value,
        params,
        error: null
      });
    } catch (err) {
      this.setState({
        raw: ev.target.value,
        error: (String(err).split("\n") || ["Invalid JSON"])[0],
      });
    }
  }
  onSubmit() {
    this.client.message("/debug/x/controller", {
      kind:       this.state.kind,
      controller: this.state.controller,
      params:     this.state.params,
    }).then(res => {
      console.log(res);
      this.setState({output: JSON.stringify(res, null, 4)});
    }).catch(err => {
      console.error(err);
      this.setState({output: JSON.stringify(err, null, 4)});
    });
  }
  render() {
    return (
      <div>
        <h1 style={this.props.styles.title}><BugReport /> シミュレータ</h1>
        <div>
          <div>
            <select onChange={ev => this.setState({kind:ev.target.value, controller:controllers[ev.target.value][0]})} value={this.state.kind}>
              <option value="request">RequestControllers</option>
              <option value="message">MessageControllers</option>
            </select>
            <select onChange={ev => this.setState({controller:ev.target.value})} value={this.state.controller}>
              {controllers[this.state.kind].map(name => {
                return <option key={name} value={name}>{name}</option>;
              })}
            </select>
          </div>
          <div style={{display:"flex"}}>
            <div style={{flex: 2}}>
              <textarea
                      style={{width: "100%", height: "240px", fontSize:"1.4em", boxSizing:"border-box"}}
                      value={this.state.raw}
                      onChange={this.onParamsChanged.bind(this)}
                    />
            </div>
            <div style={{flex: 3}}>
              <pre
                      style={{
                        width: "100%", height: "240px",
                        backgroundColor:"#2b2c34",
                        color: "#b0baca",
                        textShadow: "0 1px 0 #000",
                        padding: "8px",
                        margin: "0",
                        overflow:"scroll",
                        fontSize: "1.4em",
                        boxSizing: "border-box",
                      }}
                    >{this.state.output}</pre>
            </div>
          </div>
          <div>
            <input
                    type="submit" style={{fontSize:"4em"}} value="Execute" disabled={!!this.state.error}
                    onClick={this.onSubmit.bind(this)}
                    />
            <span style={{color: "red"}}>{this.state.error}</span>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    styles: React.PropTypes.object,
  }
}

const controllers = {
  "request": [
    "onBattleResulted",
    "onBattleStarted",
    "onCombinedBattleResulted",
    "onCombinedBattleStarted",
    "onCreateShipStart",
    "onCreateShipCompleted",
    "onDeck",
  ],
  "message": [
    "GetConfig",
    "SetConfig",
  ]
};
