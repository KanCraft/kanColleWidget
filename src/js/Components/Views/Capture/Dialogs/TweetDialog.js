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
                  ref="tweettext"
                  multiLine={true}
                  rows={4}
                  fullWidth={true}
                  />
              </div>
            </div>
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
    renderTweetActionButton() {
        return <FlatButton
          label="Tweet"
          primary={true}
          keyboardFocused={true}
          disabled={this.props.nowSending}
          onTouchTap={this.props.tweet}
        />;
    }
    getValue() {
        return this.refs.tweettext.getValue();
    }
    static propTypes = {
        tweet:       PropTypes.any,
        tweetAction: PropTypes.any,
        closeDialog: PropTypes.any,
        getImageURI: PropTypes.any,
        nowSending:  PropTypes.bool,
    }
}
