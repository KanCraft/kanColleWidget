import React, {Component} from "react";
import PropTypes    from "prop-types";
import Dialog       from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton   from "material-ui/FlatButton";
import {red300} from "material-ui/styles/colors";
import c        from "../../../Constants/colors";

class InputColumn extends Component {
  render() {
    const styles = {
      label: {},
      input: {},
    };
    const {color, label} = this.props;
    return (
      <div style={{flex: 1, display:"flex", padding:"0 8px"}}>
        <div style={{flex:1}}><span style={{...styles.label, color}}>{label}</span></div>
        <div style={{flex:1}}><input ref="input" type="number"  style={styles.input}/></div>
      </div>
    );
  }
  value() {
    return parseInt(this.refs.input.value) || null;
  }
  static propTypes = {
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
  }
}

export default class ResourceInputDialog extends Component {
  values() {
    return {...Object.keys(this.refs)
    .map(key => ({key,ref:this.refs[key]}))
    .map(e => ({[e.key]:e.ref.value()}))
    .reduce((e, self) => ({...self, ...e}), {}), created:Date.now()};
  }
  render() {
    const styles = {
      dialogImageContainer: {
        position: "relative",
        overflow: "hidden",
        width: "200px",
        height: "100px",
      },
      dialogImage: {
        width: "600%",
        position: "absolute",
        right: 0, top: 0,
      },
      dialogError: {
        color: red300,
        fontSize: "0.8em",
      },
      dialogInputRowGroup: {
        display:"flex",
        marginBottom: "8px",
      },
      dialogInputCol: {
        flex: 1,
      }
    };
    return (
      <Dialog
        actions={[
          <FlatButton label="キャンセル" style={{marginRight:"8px"}} onClick={this.props.close} />,
          <RaisedButton primary={true} label="記録" onClick={this.props.onInputCommit} />
        ]}
        open={this.props.open}
        onRequestClose={this.props.close}
        >
        <div style={{display:"flex"}}>
          <div style={styles.dialogImageContainer}>
            {this.props.error ?
              <span style={styles.dialogError}>{this.props.error}</span>
              : <img style={styles.dialogImage} src={this.props.image} />
            }
          </div>
          <div style={{flex:1, padding: "0 16px"}}>
            <div style={styles.dialogInputRowGroup}>
              {(new Date()).format("yyyy/MM/dd HH:mm")}
            </div>
            <div style={styles.dialogInputRowGroup}>
              <InputColumn ref="buckets"  label="修復材" color={c.buckets}/>
              <InputColumn ref="material" label="開発材" color={c.material}/>
            </div>
            <div style={styles.dialogInputRowGroup}>
              <InputColumn ref="fuel"  label="燃料" color={c.fuel}/>
              <InputColumn ref="steel" label="鋼材" color={c.steel}/>
            </div>
            <div style={styles.dialogInputRowGroup}>
              <InputColumn ref="ammo"    label="弾薬" color={c.ammo}/>
              <InputColumn ref="bauxite" label="ボーキサイト" color={c.bauxite}/>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
  static propTypes = {
    open:          PropTypes.bool.isRequired,
    close:         PropTypes.func.isRequired,
    error:         PropTypes.string,
    image:         PropTypes.string,
    onInputCommit: PropTypes.func.isRequired,
  }
}
