import React, {Component} from "react";
import PropTypes from "prop-types";

export default class CounterView extends Component {
  constructor(props) {
    super(props);
    this.state = {counter: this.props.counter};
  }
  delete() {
    const message = [
      "このカスタムカウンターを削除しますか？",
      `label:\t${this.props.counter.label}`,
      `count:\t${this.props.counter.count}`,
    ].join("\n");
    if (window.confirm(message)) {
      this.props.counter.delete();
      this.props.refresh();
    }
  }
  onChange(ev) {
    let counter = this.state.counter;
    counter.update({count:parseInt(ev.target.value)});
    this.setState({counter});
  }
  render() {
    const styles = {
      row: {
        display: "flex",
        alignItems: "center",
      },
      col: {
        display:        "flex",
        justifyContent: "center",
      },
      input: {
        fontSize:  "1.2em",
        width:     "100%",
        padding:   "2px",
        boxSizing: "border-box",
      }
    };
    const {counter} = this.props;
    return (
      <div style={styles.row}>
        <div style={{...styles.col, flex:2}}>
          {counter.label}
        </div>
        <div style={{...styles.col, flex:2}}>
          <input style={styles.input} type="number" value={this.state.counter.count} onChange={this.onChange.bind(this)} />
        </div>
        <div style={{...styles.col, flex:1}}>
          <span style={{cursor:"pointer"}} onClick={this.delete.bind(this)}>-</span>
        </div>
      </div>
    );
  }
  static propTypes = {
    counter: PropTypes.shape({
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    refresh: PropTypes.func.isRequired,
  }
}
