import React, {Component,PropTypes} from "react";

export default class Tweet extends Component {
    static activateAllLinks(doc) {
        for (let a of doc.querySelectorAll("a.link")) {
            a.addEventListener("click", (ev) => window.open(ev.target.href));
        }
    }
    componentDidMount() {
        this.highlight();
        this.anchorize();
    }
    highlight() {
        let innerHTML = this.refs.text.innerHTML;
        (this.props.highlights || []).map(highlight => {
            innerHTML = innerHTML.replace(highlight, `<span style="${this.highlightStyleString()}">${highlight}</span>`);
        });
        this.refs.text.innerHTML = innerHTML;
    }
    anchorize() {
        let innerHTML = this.refs.text.innerHTML;
        // XXX: まあとりあえずt.coだけ対応しときゃええやろ
        let matched = innerHTML.match(/https:\/\/t\.co\/[a-zA-Z0-9]+/);
        if (!matched) return;
        for (let i = 0; i < matched.length; i++) {
            let url = matched[i];
            innerHTML = innerHTML.replace(url, `<a href="${url}" class="link">${url}</a>`);
        }
        this.refs.text.innerHTML = innerHTML;
    }
    highlightStyleString() {
        return Object.keys(this.props.highlightStyle).map(key => {
            return `${this.toCSSDashedCase(key)}:${this.props.highlightStyle[key]}`;
        }).join(";");
    }
    toCSSDashedCase(str) {
        let dest = "";
        for (let c of str) {
            if (c.toLowerCase() == c) dest += c;
            else dest += ("-" + c.toLowerCase());
        }
        return dest;
    }
    render() {
        const styles = {
            icon: {
                width: "36px",
                height: "36px",
                borderRadius: "4px",
                cursor: "pointer",
            },
            text: {
                marginTop:       "0",
                padding:         "4px",
                borderRadius:    "4px",
                backgroundColor: "#fff",
            },
        };
        return (
          <div style={{display:"flex"}}>
            <div style={{paddingRight:"6px"}}>
              <img
                src={this.props.tweet.user.profile_image_url}
                style={styles.icon}
                onClick={this.open.bind(this)}
                />
            </div>
            <div>
              <div>
                <small>{(new Date(this.props.tweet.created_at)).toLocaleString()}</small>
              </div>
              <div>
                <p style={styles.text} ref="text">{this.props.tweet.text}</p>
              </div>
            </div>
          </div>
        );
    }
    open() {
        window.open(this.getPermalink());
    }
    getPermalink() {
        return `https://twitter.com/${this.props.tweet.user.screen_name}/statuses/${this.props.tweet.id_str}`;
    }
    static propTypes = {
        tweet:          PropTypes.object.isRequired,
        highlights:     PropTypes.array,
        highlightStyle: PropTypes.object,
    }
    static defaultProps = {
        highlights: ["メンテナンス"],
        highlightStyle: {backgroundColor:"yellow"},
    }
}
