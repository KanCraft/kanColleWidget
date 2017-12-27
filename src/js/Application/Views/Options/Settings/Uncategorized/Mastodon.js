import React, {Component} from "react";
import PropTypes          from "prop-types";

import FlatButton           from "material-ui/FlatButton";
import Delete               from "material-ui/svg-icons/action/delete";
import Dialog               from "material-ui/Dialog";
import TextField            from "material-ui/TextField";
import ContentAdd           from "material-ui/svg-icons/content/add";
import FloatingActionButton from "material-ui/FloatingActionButton";

import Mastodon from "../../../../Models/Mastodon";

export class MastodonConfig extends Component {
  render() {
    const {domain} = this.props;
    const style = {
      display:      "flex",
      alignItems: "center",
      fontSize:    "1.2em",
    };
    return (
      <div style={style}>
        <div style={{flex:1}}><a href={`https://${domain}`}>{domain}</a></div>
        <div><FlatButton icon={<Delete />} primary={true} onClick={() => this.props.del() && this.props.refresh()} /></div>
      </div>
    );
  }
  static propTypes = {
    domain:  PropTypes.string.isRequired,
    del:     PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
  }
}

export class MastodonConfigInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      domain:  "",
    };
  }
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={() => this.setState({open:false})}
      />,
      <FlatButton
        label="ADD"
        primary={true}
        disabled={this.state.domain.length < 4}
        onClick={this.commit.bind(this)}
      />,
    ];
    return (
      <div>
        <FloatingActionButton mini={true} style={{margin:"8px 0"}} onClick={() => this.setState({open:!this.state.open})}>
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          open={this.state.open}
          actions={actions}
          >
          <TextField
            name={"domain"}
            value={this.state.domain}
            onChange={ev => this.setState({domain:ev.target.value})}
            fullWidth={true}
            placeholder={"例) mastodon.social"}
          />
        </Dialog>
      </div>
    );
  }
  commit() {
    // TODO: ここで、MastodonのServiceのAuthのメソッドを叩く
    Mastodon.new({domain:this.state.domain, _id:this.state.domain}).save();
    this.setState({open: false, domain: ""});
    this.props.refresh();
  }
  static propTypes = {
    refresh: PropTypes.func.isRequired,
  };
}
