import React, {Component, PropTypes} from "react";

import FlatButton from "material-ui/FlatButton";
import Dialog     from "material-ui/Dialog";
import TextField  from "material-ui/TextField";

// import Config from "../../../Models/Config";
// import Assets from "../../../Services/Assets";

export default class ArchiveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }
  render() {
    return (
      <Dialog
            title="アーカイブに保存"
            actions={[
              this.renderCancelButton(),
              this.renderSaveButton()
            ]}
            modal={false}
            onRequestClose={this.props.close}
            open={this.props.opened}
            >
        <TextField
              ref="scrapname"
              name="scrap-name"
              placeholder="2-5編成"
              onChange={ev => this._validate(ev.target.value)}
              errorText={this.state.error}
            />
      </Dialog>
    );
  }
  renderCancelButton() {
    return <FlatButton
          label="Cancel"
          onTouchTap={this.props.close}
        />;
  }
  renderSaveButton() {
    return <FlatButton
          label="Save"
          primary={true}
          onTouchTap={() => {
            if (this._validate(this.refs.scrapname.getValue())) return;
            this.props.saveAsArchive(this.refs.scrapname.getValue());
          }}
        />;
  }
  _validate(value) {
    const error = (value ? null : "名前は必須です");
    this.setState({error});
    return error;
  }
  getValue() {
    return this.folder + this.refs.filename.getValue();
  }
  static propTypes = {
    opened:          PropTypes.bool,
    close:           PropTypes.func.isRequired,
    saveAsArchive:   PropTypes.func.isRequired,
  }
  static defaultProps = {
    opened: false,
  }
}
