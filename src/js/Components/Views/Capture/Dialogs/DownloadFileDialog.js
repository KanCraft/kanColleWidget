import React, {Component, PropTypes} from "react";

import FlatButton from "material-ui/FlatButton";
import Dialog     from "material-ui/Dialog";
import TextField  from "material-ui/TextField";

export default class DownloadFileDialog extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <Dialog
            title="Save file name"
            actions={[
                this.renderCancelButton(),
                this.renderSaveButton()
            ]}
            modal={false}
            open={this.props.dialogOpened}
            >
            ~/Downloads/<TextField name="foo" ref="filename"/>.png
          </Dialog>
        );
    }
    renderCancelButton() {
        return <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.props.closeDialog}
        />;
    }
    renderSaveButton() {
        return <FlatButton
          label="Save"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.props.saveFile}
        />;
    }
    getValue() {
        return this.refs.filename.getValue();
    }
    static propTypes = {
        dialogOpened: PropTypes.any,
        closeDialog:  PropTypes.any,
        saveFile:     PropTypes.any,
    }
}
