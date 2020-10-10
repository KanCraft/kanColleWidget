import React from "react";
import cn from "classnames";

class TweetImage extends React.Component<{
  src: string;
}> {
  render() {
    const { src } = this.props;
    return (
      <div className="column col-6">
        <img src={src} style={{ width: "100%" }} />
      </div>
    );
  }
}

export default class TweetModal extends React.Component<{
  images: () => string[];
  tweet: (text: string, indices: number[]) => Promise<string>;
  done: () => void;
  open: boolean;
}, {
  sending: boolean;
  images: string[];
  text?: string;
}> {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      images: [...this.props.images()],
    };
  }
  render() {
    const { done, open } = this.props;
    const { images, sending } = this.state;
    return (
      <div className={cn("modal", { active: open })}>
        <a className="modal-overlay" onClick={() => done()} />
        <div className="modal-container">
          <div className="modal-body container">
            <div className="columns">
              <div className="column col-12 form-group">
                <textarea
                  onChange={ev => this.setState({ text: ev.currentTarget.value })}
                  className="form-input"
                  id="input-example-3"
                  placeholder="Textarea"
                  rows={2}
                  style={{ resize: "none", marginBottom: "12px" }}
                />
              </div>
            </div>
            <div className="columns">
              {images.map((src, i) => <TweetImage key={i} src={src} />)}
            </div>
          </div>
          <div className="modal-footer">
            <button className={cn("btn", { disabled: sending })} style={{ marginRight: "4px" }}>キャンセル</button>
            <button className={cn("btn", "btn-primary", { disabled: sending })} onClick={async () => {
              this.setState({ sending: true });
              await this.props.tweet(this.state.text, [0]);
              this.setState({ sending: false });
              done();
            }}>Tweet</button>
          </div>
        </div>
      </div>
    );
  }
}