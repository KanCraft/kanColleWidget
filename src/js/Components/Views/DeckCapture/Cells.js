import React, {Component, PropTypes} from "react";

import IconButton  from "material-ui/IconButton";
import CameraEnhance from "material-ui/svg-icons/action/camera-enhance";

import Avatar from "material-ui/Avatar";
import Close  from "material-ui/svg-icons/navigation/close";

class ImageCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hovered: false
        };
    }
    render() {
        return (
          <div style={{position: "relative"}}>
            {this.getDeleteButton()}
            <img src={this.props.src} style={{width: "100%"}} />
          </div>
        );
    }
    getDeleteButton() {
        const style = {
            position:        "absolute",
            right:           "0",
            cursor:          "pointer",
            transition:      "all 0.1s",
            backgroundColor: "transparent",
            opacity: this.state.hovered ? "1" : "0",
        };
        return (
          <Avatar
            onClick={() => this.props.deleteCell(this.props.index)}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            icon={<Close />}
            style={style} />
        );
    }
    onMouseEnter() {
        this.setState({hovered: true});
    }
    onMouseLeave() {
        this.setState({hovered: false});
    }
    static propTypes = {
        src:        PropTypes.string.isRequired,
        deleteCell: PropTypes.func.isRequired,
        index:      PropTypes.number.isRequired,
    }
}

class CameraCell extends Component {
    render() {
        const styles = {
            width: "96%",
            border: "thick dashed #dedede",
            height: "100px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        };
        return (
          <div style={styles}>
            <IconButton onClick={this.props.onClick}>
              <CameraEnhance size={60} />
            </IconButton>
          </div>
        );
    }
    static propTypes = {
        onClick: PropTypes.func
    }
}

class EmptyCell extends Component {
  // <img src="https://pbs.twimg.com/profile_images/768484427412467717/pH5kS7Kw_400x400.jpg" width="100%"/>
    render() {
        return (
          <div style={{width: "96%", border: "thick dashed #f0f0f0", height: "100px", textAlign: "center"}}>
          </div>
        );
    }
}

export {
  ImageCell,
  CameraCell,
  EmptyCell,
};
