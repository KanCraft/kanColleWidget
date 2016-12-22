import React, {Component,PropTypes} from "react";

import Dialog from "material-ui/Dialog";
import {grey600} from "material-ui/styles/colors";
import FlatButton from "material-ui/FlatButton";

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

export default class ManualTimerDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hours:   0,
            minutes: 0,
            open:    this.props.open,
        };
    }
    onChange(ev) {
        this.setState({[ev.target.name]:parseInt(ev.target.value)});
    }
    getUnit() {
        if (!this.props.queue) return;
        switch ((this.props.queue.params || this.props.queue).type) {
        case "mission":    case "missions":    return "艦隊";
        case "recovery":   case "recoveries":  return "ドック";
        case "createship": case "createships": return "ドック";
        case "default":    return "なんか";
        }
    }
    getName() {
        if (!this.props.queue) return;
        switch ((this.props.queue.params || this.props.queue).type) {
        case "mission":    case "missions":    return "遠征";
        case "recovery":   case "recoveries":  return "修復";
        case "createship": case "createships": return "建造";
        case "default":    return "なんか";
        }
    }
    getID() {
        if (!this.props.queue) return;
        return this.props.queue.identifier;
    }
    render() {
        return (
            <Dialog
              open={this.props.open}
              onRequestClose={() => this.props.close()}
              >
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
                <FlatButton label="しません" style={{color: grey600}} onClick={() => this.props.close()}/>
              </div>
            </Dialog>
        );
    }
    onCommit() {
        let time = {h:this.state.hours, m:this.state.minutes, s:0};
        this.props.onCommit(time).then(() => this.props.close());
    }
    static propTypes = {
        open:     PropTypes.bool.isRequired,
        close:    PropTypes.func.isRequired,
        onCommit: PropTypes.func.isRequired,
        queue:    PropTypes.object,
    }
}
