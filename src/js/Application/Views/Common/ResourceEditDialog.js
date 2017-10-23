import React, {Component} from "react";
import PropTypes from "prop-types";
import Dialog       from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton   from "material-ui/FlatButton";
import colors       from "../../../Constants/colors";

export default class ResourceEditDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: null,
    };
  }
  onEditCommit() {
    this.props.onEditCommit(this.state.resource);
  }
  componentWillReceiveProps(prop) {
    if (prop.target && prop.target._id) this.setState({resource:prop.target});
  }
  renderRow(r) {
    if (!r) return null;
    return (
      <div style={{display:"flex", marginBottom:"8px"}}>
        <div style={{flex:1,fontSize:"0.7em"}}>{(new Date(r.created)).format("yyyy/MM/dd HH:mm")}</div>
        {["fuel","ammo","steel","bauxite","buckets","material"].map(key => {
          return (
            <div key={key} style={{flex:1,color:colors[key],fontSize:"0.7em",textAlign:"right"}}>
              <span style={{paddingRight:"16px",fontFamily:"Helvetica"}}>{r[key]}</span>
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    if (!this.props.target) return null;
    if (!this.state.resource) return null;
    return (
      <Dialog
        actions={[
          <FlatButton label="キャンセル" style={{marginRight:"8px"}} onClick={this.props.close} />,
          <RaisedButton primary={true} label="更新" onClick={this.onEditCommit.bind(this)} />
        ]}
        open={this.props.open}
        onRequestClose={this.props.close}
        >
        <div>
          {this.renderRow(this.props.prev)}
          <div style={{display:"flex",marginBottom:"8px"}}>
            <div style={{flex:1,fontSize:"0.7em"}}>{(new Date(this.state.resource.created)).format("yyyy/MM/dd HH:mm")}</div>
            {["fuel","ammo","steel","bauxite","buckets","material"].map(key => {
              return (
                <div style={{flex:1}} key={key}>
                  <input
                    style={{color:colors[key],width:"100%",boxSizing:"border-box",textAlign:"right",fontFamily:"Helvetica"}}
                    min={0} type="number"
                    value={this.state.resource[key]}
                    onChange={ev => {
                      let r = this.state.resource;
                      r[key] = parseInt(ev.target.value);
                      this.setState({resource:r});
                    }}
                  />
                </div>
              );
            })}
          </div>
          {this.renderRow(this.props.next)}
        </div>
      </Dialog>
    );
  }
  static propTypes = {
    open:         PropTypes.bool.isRequired,
    close:        PropTypes.func.isRequired,
    onEditCommit: PropTypes.func.isRequired,
    target:       PropTypes.object,
    prev:         PropTypes.object,
    next:         PropTypes.object,
  }
}
