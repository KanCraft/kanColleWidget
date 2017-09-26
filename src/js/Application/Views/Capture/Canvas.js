import React, {Component} from "react";
import PropTypes from "prop-types";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.tool = null;
    this.isMouseDown = false;
    this.defaultCursor = "pointer";
    this.state = {cursor: this.defaultCursor};
    this.history = [];
  }
  render() {
    return (
      <div style={{flex: 1, marginTop: "12px"}}>
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
  toDataURL(fmt = ("image/" + this.props.ext), quality = undefined) {
    return this.refs.canvas.toDataURL(fmt, quality);
  }
  onMouseDown(ev) {
    this.tool = this.props.getTool(this.refs.canvas);
    this.isMouseDown = true;
    this.setState({cursor: this.tool.cursor});
    this.pushHistory();
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
  pushHistory() {
    const mem = {
      data: this.refs.canvas.getContext("2d").getImageData(
              0, 0, this.refs.canvas.width, this.refs.canvas.height
          )
    };
    this.history.push(mem);
  }
  popHistory() {
    const mem = this.history.pop();
    if (!mem) return;// なにもしない
    this.refs.canvas.getContext("2d").putImageData(mem.data, 0, 0);
  }
  undo() {
    this.popHistory();
  }
  getSmallerImageURI() {
    const rate = 2/3; // TODO: 変えれるようにする？
    let canvas = document.createElement("canvas");
    canvas.width  = this.refs.canvas.width  * rate;
    canvas.height = this.refs.canvas.height * rate;
    const original = this.refs.canvas.toDataURL("image/png");
    return Image.init(original).then(img => {
      canvas.getContext("2d").drawImage(
              img,
              0, 0, img.width, img.height,
              0, 0, canvas.width, canvas.height
            );
      return Promise.resolve(canvas);
    }).then(cnvs => Promise.resolve(cnvs.toDataURL("image/png")));
  }
  static propTypes = {
    getTool: PropTypes.func.isRequired,
    ext:     PropTypes.string.isRequired,
  }
}
