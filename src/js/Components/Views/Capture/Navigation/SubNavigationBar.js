import React, {Component, PropTypes} from "react";

import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";

const styles = {
    bar: {
        width: "100%",
        height: "48px",
        alignItems: "center",
    },
    item: {
        display: "inline-block",
        padding: "0 0 0 16px",
        textAlign: "center",
    }
};

class Item extends Component {
    render() {
        return (
          <div style={styles.item}>{this.props.children}</div>
        );
    }
    static propTypes = {
        children: PropTypes.any.isRequired
    }
}

export default class SubNavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        };
    }
    render() {
        return (
            <Paper style={styles.bar}>
              {this.renderColorPicker()}
              {this.renderTextField()}
            </Paper>
        );
    }
    renderColorPicker() {
        return (
          <Item>
            <input type="color" onChange={this.props.onColorChanged} />
          </Item>
        );
    }
    renderTextField() {
        return (
          <Item>
            <TextField placeholder="text" name="text" onChange={this.onTextChange.bind(this)} />
          </Item>
        );
    }
    onTextChange(ev) {
        this.setState({text: ev.target.value});
    }
    getText() {
        return this.state.text;
    }
    static propTypes = {
        onColorChanged: PropTypes.func.isRequired,
    }
}
