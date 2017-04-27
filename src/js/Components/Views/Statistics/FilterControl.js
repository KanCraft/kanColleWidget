import React, {Component} from "react";
import PropTypes from "prop-types";
import DatePicker from "material-ui/DatePicker";
import Resource from "../../Models/Resource";

export default class FilterControl extends Component {
  render() {
    const styles = {
      outline: {
        margin: "0 auto",
        display: "flex",
      },
      col: {
        display: "flex",
        alignItems: "center",
      }
    };
    const first = new Date(Resource.first().created);
    return (
      <div style={styles.outline}>
        <div style={styles.col}>
          <DatePicker
            hintText="From"
            minDate={first} maxDate={new Date()}
            defaultDate={first}
            onChange={(_, date) => this.props.onTermChanged("from", date)}
          />
        </div>
        <div style={styles.col}>　〜　</div>
        <div style={styles.col}>
          <DatePicker
            hintText="To"
            minDate={first} maxDate={new Date()}
            defaultDate={new Date()}
            onChange={(_, date) => this.props.onTermChanged("to", date)}
          />
        </div>
      </div>
    );
  }
  static propTypes = {
    onTermChanged: PropTypes.func.isRequired,
  }
}
