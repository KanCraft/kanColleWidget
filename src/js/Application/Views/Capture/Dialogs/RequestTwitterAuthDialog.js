import React, {Component} from "react";
import PropTypes from "prop-types";

import FlatButton from "material-ui/FlatButton";
import Dialog     from "material-ui/Dialog";

export default class RequestTwitterAuthDialog extends Component {
  render() {
    return (
      <Dialog
            title="You should authenticate `艦これウィジェット` on Twitter"
            actions={[
              this.renderCancelButton(),
              this.renderAuthButton()
            ]}
            modal={false}
            open={(this.props.tweetAction == "auth")}
          >画像付きツイートはTwitterによる認証が必要です。自動的なツイートの投稿や操作はありません。[AUTHENTICATE]ボタンを押すと、Twitterのページにリダイレクトします。</Dialog>
    );
  }
  renderCancelButton() {
    return <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.props.closeDialog}
        />;
  }
  renderAuthButton() {
    return <FlatButton
          label="Authenticate"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.props.auth}
        />;
  }
  static propTypes = {
    tweetAction: PropTypes.any,
    closeDialog: PropTypes.any,
    auth:        PropTypes.any,
  }
}
