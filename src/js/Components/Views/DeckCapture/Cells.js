import React, {Component, PropTypes} from "react";

import IconButton  from "material-ui/IconButton";
import CameraEnhance from "material-ui/svg-icons/action/camera-enhance";

class ImageCell extends Component {
    render() {
        return (
          <div>
            <img src={this.props.src} style={{width: "100%"}} />
          </div>
        );
    }
    static propTypes = {
        src: PropTypes.string.isRequired
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
