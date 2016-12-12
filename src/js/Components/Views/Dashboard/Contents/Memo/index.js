import React, {Component,PropTypes} from "react";
import RaisedButton from "material-ui/RaisedButton";

export default class DashboardMemo extends Component {
    render() {
        return (
          <div style={{...this.props.style}}>
              <RaisedButton label="WIKIの早見表" onClick={() => window.open("/dest/html/wiki.html")} />
          </div>
        );
    }
    static propTypes = {
        style: PropTypes.object.isRequired,
    }
}
