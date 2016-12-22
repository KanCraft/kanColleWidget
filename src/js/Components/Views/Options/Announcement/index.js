import React, {Component,PropTypes} from "react";

import Paper  from "material-ui/Paper";
import Avatar from "material-ui/Avatar";
import Close  from "material-ui/svg-icons/navigation/close";
import {grey600} from "material-ui/styles/colors";

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
        text.match(/\[[^\]]+\]/g).map(matched => {
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
        return (
          <div style={{display:"flex", margin: "36px 0"}}>
            <div style={{flex: "1"}}>
              <Paper style={balloon} zDepth={3}>
                <h1 style={title}>{this.props.meta.version()}</h1>
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
