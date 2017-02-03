import React, {Component,PropTypes} from "react";

import Dialog from "material-ui/Dialog";
import {grey600} from "material-ui/styles/colors";
import FlatButton from "material-ui/FlatButton";

import {MISSION, RECOVERY, CREATESHIP} from "../../../../../Constants";

const styles = {
    title: {
        fontSize: "0.8em",
        padding:  "12px 0",
    },
    number: {
        backgroundColor:  "transparent",
        WebkitAppearance: "none",
        width:            "80%",
        fontSize:         "1em",
        border:           "none",
        textAlign:        "center",
        color:            grey600,
    }
};

export class ManualTimerContents extends Component {
    constructor(props) {
        super(props);
        this.state = this._getInitialState();
    }
    _getInitialState() {
        if (!this.props.queue.scheduled) return {hours:0,minutes: 0};
        const hours = Math.floor((this.props.queue.scheduled - Date.now())/(60*60*1000));
        const minutes = Math.floor((this.props.queue.scheduled - Date.now() - hours*60*60*1000)/(60*1000));
        return {hours, minutes};
    }
    onChange(ev) {
        this.setState({[ev.target.name]:parseInt(ev.target.value)});
    }
    getUnit() {
        if (!this.props.queue) return;
        switch ((this.props.queue.params || this.props.queue).type) {
        // FIXME: 表記ゆれの名残。複数形の方はいずれ消す
        case MISSION:    case "missions":    return "艦隊";
        case RECOVERY:   case "recoveries":  return "ドック";
        case CREATESHIP: case "createships": return "ドック";
        case "default":  return "なんか";
        }
    }
    getName() {
        if (!this.props.queue) return;
        switch ((this.props.queue.params || this.props.queue).type) {
        case MISSION:    return "遠征";
        case RECOVERY:   return "修復";
        case CREATESHIP: return "建造";
        case "default":  return "なんか";
        }
    }
    getID() {
        if (!this.props.queue) return;
        return this.props.queue.identifier;
    }
    render() {
        return (
          <div>
              <span style={styles.title}>{`第${this.getID()}${this.getUnit()}の${this.getName()}完了通知を登録しますか？`}</span>
              <div style={{display: "flex", fontSize: "1.6em"}}>
                <div style={{flex: "1"}}>
                  <input type="number" value={this.state.hours}   name="hours"   onChange={this.onChange.bind(this)} min="0" max="240" style={styles.number} />
                </div>
                <div>:</div>
                <div style={{flex: "1"}}>
                  <input type="number" value={this.state.minutes} name="minutes" onChange={this.onChange.bind(this)} min="0" max="59"  style={styles.number} />
                </div>
                <div>
                  <span>後</span>
                </div>
              </div>
              <div>
                <FlatButton label="登録"    primary={true} style={{float: "right"}} onClick={this.onCommit.bind(this)}/>
                <FlatButton label="しません" style={{color: grey600}} onClick={this.props.onCancel}/>
              </div>
          </div>
        );
    }
    onCommit() {
        let time = {h:this.state.hours, m:this.state.minutes, s:0};
        this.props.onCommit(time);
    }
    static propTypes = {
        onCommit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        queue:    PropTypes.object,
    }
}

export default class ManualTimerDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open:    this.props.open,
        };
    }
    render() {
        return (
            <Dialog
              open={this.props.open}
              onRequestClose={() => this.props.close()}
              >
              <ManualTimerContents
                queue={this.props.queue}
                onCommit={this.onCommit.bind(this)}
                onCancel={() => this.props.close()}
                />
            </Dialog>
        );
    }
    onCommit(time) {
        this.props.onCommit(time).then(() => this.props.close());
    }
    static propTypes = {
        open:     PropTypes.bool.isRequired,
        close:    PropTypes.func.isRequired,
        onCommit: PropTypes.func.isRequired,
        queue:    PropTypes.object,
    }
}
