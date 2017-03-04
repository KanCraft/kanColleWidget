import React, {Component,PropTypes} from "react";

export default class ClockRow extends Component {
  constructor(props) {
    super(props);
    this.state = {now: new Date()};
  }
  componentDidMount() {
    this.setState({
      interval: setInterval(this.update.bind(this), 1000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  update() {
    this.setState({now: new Date()});
  }
  render() {
    return (
      <div style={{display: "flex", justifyContent: "center", marginBottom: "12px"}}>
        <div style={{width: "90px", display:"flex", alignItems:"center", position:"relative"}}>
          {this.getDate()}
          {this.getSeconds()}
          {this.props.avatar}
        </div>
        <div style={{flex: "1"}}>
          <div style={{width: "100%", height:"100%"}}>
            <div style={{textAlign:"center"}}>
              <span>{this.getDayOfWeek()}</span>
            </div>
            <div style={{textAlign:"center"}}>
              {this.getTime()}
            </div>
          </div>
        </div>
      </div>
    );
  }
  getDate() {
    return (
      <span style={{position: "absolute", top: "0", left: "0"}}>
        {this.state.now.getMonth() + 1}月 {this.state.now.getDate()}日
            </span>
    );
  }
  getSeconds() {
    return (
      <span style={{position: "absolute", bottom: "12px", right:"0"}}>
        {this.state.now.getSeconds()}
      </span>
    );
  }
  getDayOfWeek() {
    const b = {padding: "0 8px", textShadow: "0 1px 0 white"};
    const s = {fontWeight: "900",textDecoration: "underline"};
    return ["日", "月", "火", "水", "木", "金", "土"].map((d, i) => {
      const t = i == this.state.now.getDay();
      return <span key={i} style={{...b, ...t ? s : {}}}>{d}</span>;
    });
  }
  getTime() {
    return (
      <span style={{fontSize:"6em"}}>
        {this.state.now.getHours()}
        <span style={(this.state.blink) ? {color:"white"} : null}>:</span>
        {("0" + this.state.now.getMinutes()).slice(-2)}
      </span>
    );
  }
  static propTypes = {
    avatar: PropTypes.element.isRequired,
  }
}
