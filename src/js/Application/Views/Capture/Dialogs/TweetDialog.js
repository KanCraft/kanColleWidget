import React, {Component} from "react";
import PropTypes from "prop-types";

import FlatButton from "material-ui/FlatButton";
import Dialog     from "material-ui/Dialog";
import TextField  from "material-ui/TextField";
import Chip       from "material-ui/Chip";

export default class TweetDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
    };
    setTimeout(() => {
      const params = new URLSearchParams(location.search);
      this.setState({tags: params.getAll("tag") || []});
    }, 100);
  }
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
                return (new URL(location.href)).searchParams.get("text");
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
            {this.renderTags()}
            <TextField
              name="reply"
              ref="reply"
              fullWidth={true}
              placeholder={"リプライにしたい対象ツイートのURLをここに貼る"}
              style={{fontSize:"0.8em"}}
            />
          </div>
        </div>
      </Dialog>
    );
  }
  renderTags() {
    if (!this.state.tags) return null;
    return (
      <div style={{display:"flex", flexWrap:"wrap"}}>
        {this.state.tags.map((tag, i) => {
          return <Chip
            key={i}
            labelStyle={{fontSize: "0.8em"}}
            style={{marginRight: 4, marginBottom: 4}}
            onRequestDelete={() => this.setState({tags: this.state.tags.filter(t => t != tag)})}
          >#{tag}</Chip>;
        })}
      </div>
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
  getTags() {
    return this.state.tags || [];
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
