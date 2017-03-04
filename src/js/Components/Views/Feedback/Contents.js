import React, {Component} from "react";
import TextField from "material-ui/TextField";

export default class FeedbackContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body:  "",
      view:  "",
      asIs:  "",
      toBe:  "",
      issue: "",
      errors: {},
      env:   window.navigator.userAgent,
      version: chrome.runtime.getManifest().version,
    };
    this.styles = {
      row:{marginBottom: "8px", width:"100%"}
    };
    this.onTextFieldChange = this.onTextFieldChange.bind(this);
  }
  onTextFieldChange(ev) {
    this.setState({[ev.target.name]:ev.target.value});
  }
  _validate() {
    let errors = [];
    if (this.state.title.length == 0) {
      const description = "「概要」が入力されていません。";
      errors.push({key: "title", description});
    }
    return errors;
  }
  render() {
    let errors = this._validate().reduce((self,err) => Object.assign(self, {[err.key]:err.description}), {});
    return (
      <div>
        <div style={this.styles.row}>
          <TextField name="title" fullWidth={true}
                  value={this.state.title}
                  onChange={this.onTextFieldChange}
                  errorText={errors["title"]}
                  hintText="30字以内"
                  floatingLabelText="概要"/>
        </div>
        {this.getSpecificForms()}
        <div style={this.styles.row}>
          <TextField name="env" fullWidth={true}
                  value={this.state.env}
                  onChange={this.onTextFieldChange}
                  hintText="window.navigator.userAgent"
                  floatingLabelText="環境"/>
        </div>
        <div style={this.styles.row}>
          <TextField name="version" fullWidth={true}
                  value={this.state.version}
                  onChange={this.onTextFieldChange}
                  hintText="chrome.runtime.getManifest().version"
                  floatingLabelText="バージョン"/>
        </div>
      </div>
    );
  }
}
