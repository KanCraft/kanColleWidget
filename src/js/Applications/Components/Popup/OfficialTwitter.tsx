import React from "react";
import TwitterAPI, { Status, User } from "../../../Services/API/Twitter";
import { sleep } from "../../../utils";

class TweetStatusView extends React.Component<{
  id_str: string;
  text: string;
  user: User;
  created_at: string;
}> {
  render() {
    const { text, user, created_at, id_str } = this.props;
    const proflink = `https://twitter.com/${user.screen_name}`;
    const permlink = `${proflink}/status/${id_str}`;
    return (
      <div className="columns status">
        <div className="column col-1">
          <figure onClick={() => window.open(proflink)} className="avatar avatar-sm">
            <img src={user.profile_image_url_https} alt="..." />
          </figure>
        </div>
        <div className="column">
          <div className="text-small">{text}</div>
          <div
            onClick={() => window.open(permlink)}
            className="text-tiny text-right text-primary c-hand">{new Date(created_at).format("yyyy/MM/dd HH:mm")}</div>
        </div>
      </div>
    );
  }
}

export default class OfficialTwitterView extends React.Component<{}, {
  statuses: Status[];
}> {
  constructor(props) {
    super(props);
    this.state = { statuses: [] };
  }
  async componentDidMount() {
    try {
      const api = new TwitterAPI();
      const [statuses] = await Promise.all([
        api.getOfficialTweets(),
        sleep(800),
      ]);
      this.setState({ statuses });
    } catch (e) {
      // TODO: どうにかしてエラーを表示する
      console.log("にゃーん");
    }
  }
  render() {
    const { statuses } = this.state;
    if (statuses.length == 0) {
      return this.renderLoading();
    }
    return this.tweets(statuses);
  }
  renderLoading() {
    return (
      <div className="columns official-twitter">
        <div className="loader-ripple">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  tweets(statuses: Status[]) {
    return (
      <div className="official-twitter tweet-container">
        {statuses.map(status => <TweetStatusView key={status.id_str} {...status} />)}
      </div>
    );
  }
}