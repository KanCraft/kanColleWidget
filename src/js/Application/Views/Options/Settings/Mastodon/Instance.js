import React, {Component} from "react";
import PropTypes from "prop-types";

import {Card, CardHeader} from "material-ui/Card";

export default class InstanceView extends Component {
  render() {
    const url = new URL(this.props.rawurl);
    const myself = this.props.myself || {};
    return (
      <Card style={{marginBottom: "16px"}}>
        <CardHeader
          avatar={myself.avatar}
          title={url.host}
          subtitle={`@${myself.username}`}
        />
      </Card>
    );
  }
  static propTypes = {
    accessToken: PropTypes.object,
    rawurl: PropTypes.string.isRequired,
    myself: PropTypes.object,
  }
}