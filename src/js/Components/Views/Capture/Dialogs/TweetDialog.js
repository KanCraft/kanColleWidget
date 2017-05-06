import React, {Component, PropTypes} from "react";

import FlatButton from "material-ui/FlatButton";
import Dialog     from "material-ui/Dialog";
import TextField  from "material-ui/TextField";

export default class TweetDialog extends Component {
  render() {
    return (
      <Dialog
            title="Tweet"
            actions={[
              this.renderCancelButton(),
              this.renderTweetActionButton()
            ]}
            modal={false}
            open={(this.props.tweetAction == "tweet")}
          >
        <div style={{display: "flex", width: "100%"}}>
          <div style={{flex: 2}}><img src={this.props.getImageURI()} style={{width: "90%"}} /></div>
          <div style={{flex: 3, padding: "0 10px"}}>
            <TextField
              name="tweettext"
              ref={tweettext => {
                if (!tweettext) return;
                tweettext.focus();
                this.tweettext = tweettext;
              }}
              defaultValue={function(){
                return (new URL(location.href)).searchParams.get("text") || "";
              }()}
              multiLine={true}
              rows={4}
              fullWidth={true}
              onKeyDown={ev => {
                if (ev.key == "Enter" && (ev.ctrlKey || ev.metaKey)) {
                  this.props.onTweetKeyMapEntered();
                }
              }}
            />
            <TextField
              name="reply"
              ref="reply"
              fullWidth={true}
              underlineShow={false}
              placeholder={"リプライにしたい対象ツイートのURLをここに貼る"}
              style={{fontSize:"0.8em"}}
            />
          </div>
        </div>
      </Dialog>
    );
  }
  renderCancelButton() {
    return <FlatButton
          label="Cancel"
          onTouchTap={this.props.closeDialog}
        />;
  }
  renderTweetActionButton() {
    return <FlatButton
          label="Tweet"
          primary={true}
          disabled={this.props.nowSending}
          onTouchTap={this.props.tweet}
        />;
  }
  getValue() {
    return this.tweettext.getValue();
  }
  getReply() {
    const id = this.refs.reply.getValue().split("/").pop();
    return /[0-9]+/.test(id) ? id : null;
  }
  static propTypes = {
    tweet:       PropTypes.any,
    tweetAction: PropTypes.any,
    closeDialog: PropTypes.any,
    getImageURI: PropTypes.any,
    nowSending:  PropTypes.bool,
    onTweetKeyMapEntered: PropTypes.func.isRequired,
  }
}
