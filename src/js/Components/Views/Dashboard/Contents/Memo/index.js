import React, {Component,PropTypes} from "react";
import RaisedButton from "material-ui/RaisedButton";
import Memo from "../../../../Models/Memo";

class MemoView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: Memo.find("text"),
        };
        this.lines = this.state.text.value.split("\n").length;
        this.fontSize = 12;
    }
    onChangeMemoText(ev) {
        let text = this.state.text;
        text.value = ev.target.value;
        text.save();
        this.setState({text});
    }
    render() {
        const height = (this.lines + 1) * (this.fontSize + 4) + "px";
        return (
          <textarea
            style={{width:"100%", fontSize: this.fontSize + "px", height}}
            onChange={this.onChangeMemoText.bind(this)}
            value={this.state.text.value}
            >
          </textarea>
        );
    }
}

export default class DashboardMemo extends Component {
    render() {
        return (
          <div style={{...this.props.style}}>
              <div style={{marginRight:"28px"}}>
                <MemoView />
              </div>
              <RaisedButton label="WIKIの早見表" onClick={() => window.open("/dest/html/wiki.html")} />
          </div>
        );
    }
    static propTypes = {
        style: PropTypes.object.isRequired,
    }
}
