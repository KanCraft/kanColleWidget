import React, {Component,PropTypes} from "react";

export default class DashboardMemo extends Component {
    render() {
        return (
          <div style={{...this.props.style}}>
            <span>ｃ⌒っﾟдﾟ)っφ　ﾒﾓﾒﾓ... 建設予定地</span>
          </div>
        );
    }
    static propTypes = {
        style: PropTypes.object.isRequired,
    }
}
