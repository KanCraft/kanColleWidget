import React, {Component,PropTypes} from "react";

import Paper  from "material-ui/Paper";
import Avatar from "material-ui/Avatar";
import Close  from "material-ui/svg-icons/navigation/close";
import {grey600} from "material-ui/styles/colors";

// TODO: これどっかに持ってく
class GitHubIcon extends Component {
    render() {
        return (
            <svg height="18" fill="#39f" version="1.1" viewBox="0 0 16 16" width="28"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
        );
    }
}

class BonoChan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            opacity: "1",
        };
    }
    render() {
        return (
          <div
            style={{position: "relative", transition: "all 0.2s", opacity: this.state.opacity}}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            >
            <Avatar color={grey600} icon={<Close />} style={this.closeStyle()} onClick={this.onClickClose.bind(this)}/>
            <img src="/dest/img/bono.png" height="200px" />
            <span style={{position:"absolute", right: "0",bottom:"0", fontSize:"0.8em"}}>Illustrated by <a href="http://roonyan.com">@roonyan</a></span>
          </div>
        );
    }
    closeStyle() {
        return {
            cursor: "pointer",
            position: "absolute",
            top: "0", right: "0",
            opacity: (this.state.hover) ? "0.8" : "0",
            transition: "all 0.2s",
            backgroundColor: "white",
        };
    }
    onClickClose() {
        this.setState({opacity: "0"});
        this.props.meta.checkUpdate();
        setTimeout(() => {
            this.props.update();
        }, 200);
    }
    onMouseEnter() {
        this.setState({hover:true});
    }
    onMouseLeave() {
        this.setState({hover:false});
    }
    static propTypes = {
        meta: PropTypes.object.isRequired,
        update: PropTypes.func.isRequired,
    }
}

export default class Announcement extends Component {
    constructor(props) {
        super(props);
    }
    html(text) {
        (text.match(/\[[^\]]+\]/g) || []).map(matched => {
            let contents = matched.replace(/[\[\]]/g, "");
            let fragments = contents.split("|");
            if (fragments.length > 1) {
                text = text.replace(matched, `<a href="${fragments[1]}">${fragments[0]}</a>`);
            } else {
                text = text.replace(matched, `<a href="${fragments[0]}">${fragments[0]}</a>`);
            }
        });
        return {__html: text};
    }
    getFeatures() {
        return this.props.meta.release().features.map((feature,i) => {
            return <li key={i} dangerouslySetInnerHTML={{__html:feature}} />;
        });
    }
    getComment() {
        const comment = this.props.meta.release().comment;
        if (!comment) return;
        return <p dangerouslySetInnerHTML={this.html(comment)} />;
    }
    render() {
        const balloon = {
            margin: "0 20px 12px 0",
            padding: "12px",
            borderRadius: "6px",
        };
        const title = {
            margin: "0",
        };
        const url = `https://github.com/otiai10/kanColleWidget/releases/tag/${this.props.meta.version()}`;
        return (
          <div style={{display:"flex", margin: "36px 0"}}>
            <div style={{flex: "1"}}>
              <Paper style={balloon} zDepth={3}>
                <h1 style={title}>{this.props.meta.version()} <a href={url}><GitHubIcon /></a></h1>
                <ul>{this.getFeatures()}</ul>
                {this.getComment()}
              </Paper>
            </div>
            <div>
              <BonoChan meta={this.props.meta} update={this.props.update} />
            </div>
          </div>
        );
    }
    static propTypes = {
        meta:   PropTypes.object.isRequired,
        update: PropTypes.func.isRequired,
    }
}
