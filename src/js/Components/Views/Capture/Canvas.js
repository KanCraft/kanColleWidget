import React, {Component, PropTypes} from "react";

export default class Canvas extends Component {
    constructor(props) {
        super(props);
        this.tool = null;
        this.isMouseDown = false;
        this.defaultCursor = "pointer";
        this.state = {cursor: this.defaultCursor};
    }
    render() {
        return (
          <div style={{flex: 1}}>
            <canvas
              ref="canvas"
              style={{maxWidth: "100%", boxShadow: "0 1px 6px #a0a0a0", cursor: this.state.cursor}}
              onMouseDown={this.onMouseDown.bind(this)}
              onMouseMove={this.onMouseMove.bind(this)}
              onMouseUp={this.onMouseUp.bind(this)}
            />
          </div>
        );
    }
    initWithImage(img) {
        this.refs.canvas.width = img.width;
        this.refs.canvas.height = img.height;
        this.refs.canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    }
    toDataURL(fmt = "image/png", quality = 1) {
        return this.refs.canvas.toDataURL(fmt, quality);
    }
    onMouseDown(ev) {
        this.tool = this.props.getTool(this.refs.canvas);
        this.isMouseDown = true;
        this.setState({cursor: this.tool.cursor});
        this.tool.onStart(ev);
    }
    onMouseMove(ev) {
        if (!this.tool) return;
        if (!this.isMouseDown) return;
        this.tool.onMove(ev);
    }
    onMouseUp(ev) {
        if (!this.tool) return;
        if (!this.isMouseDown) return;
        this.isMouseDown = false;
        this.tool.onEnd(ev);
        this.setState({cursor: this.defaultCursor});
    }
    static propTypes = {
        getTool: PropTypes.any // TODO: なんでfuncでvalidじゃないんだ
    }
}
