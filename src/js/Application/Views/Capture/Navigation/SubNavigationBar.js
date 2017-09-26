import React, {Component} from "react";
import PropTypes from "prop-types";

import Paper       from "material-ui/Paper";
import TextField   from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem    from "material-ui/MenuItem";
import Checkbox    from "material-ui/Checkbox";

const styles = {
  bar: {
    width: "100%",
    height: "48px",
    alignItems: "center",
  },
  item: {
        // display: "inline-block",
        // paddingLeft: "0 0 0 16px",
    marginLeft: "16px",
    textAlign: "center",
  }
};

class Item extends Component {
  render() {
    return (
      <div style={{...styles.item, ...this.props.style}}>{this.props.children}</div>
    );
  }
  static propTypes = {
    children: PropTypes.any.isRequired,
    style:    PropTypes.object,
  }
}

export default class SubNavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      size: "4.0em",
      font: "Helvetica",
      fill: true,
    };
  }
  render() {
    return (
      <Paper style={styles.bar}>
        <div style={{display:"flex"}}>
          {this.renderFillCheckbox()}
          {this.renderColorPicker()}
          {this.renderTextField()}
          {this.renderFontFamilies()}
          {this.renderTextSize()}
        </div>
      </Paper>
    );
  }
  renderFillCheckbox() {
    return (
      <Item style={{display:"flex",alignItems:"center",height:"48px"}}>
        <Checkbox label="fill" checked={this.state.fill} onCheck={(_, fill) => this.setState({fill})} />
      </Item>
    );
  }
  renderColorPicker() {
    return (
      <Item style={{display:"flex",alignItems:"center",height:"48px"}}>
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
  renderTextSize() {
    const items = (Array.apply(null, new Array(9))).map((v, i) => {
      const size = ((i+1) + ".0").slice(0,3) + "em";
      return <MenuItem key={i} value={size} primaryText={size} />;
    });
    return (
      <Item>
        <SelectField value={this.state.size} style={{width: "96px"}} onChange={this.onSizeChange.bind(this)}>
          {items}
        </SelectField>
      </Item>
    );
  }
  renderFontFamilies() {
    const items = [
      "Helvetica",
      "Arial Black",
      "Comic Sans MS",
      "Impact",
      "Georgia",
      "Trebuchet MS",
      "monospace",
    ].map(name => {
      return <MenuItem key={name} value={name} primaryText={this.fontLabel(name)}/>;
    });
    return (
      <Item>
        <SelectField value={this.state.font} style={{width: "168px"}} onChange={this.onFontChange.bind(this)}>
          {items}
        </SelectField>
      </Item>
    );
  }
  onSizeChange(ev, i, size) {
    this.setState({size});
  }
  onFontChange(ev, i, font) {
    this.setState({font});
  }
  fontLabel(name) {
    return <span style={{fontFamily:name}}>{name}</span>;
  }
  onTextChange(ev) {
    this.setState({text: ev.target.value});
  }
  getText() {
    return this.state.text;
  }
  getFont() {
    return this.state.font;
  }
  getSize() {
    return this.state.size;
  }
  getFill() {
    return this.state.fill;
  }
  static propTypes = {
    onColorChanged: PropTypes.func.isRequired,
  }
}
