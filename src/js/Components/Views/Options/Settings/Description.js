import React, {Component, PropTypes} from "react";
import {grey400} from "material-ui/styles/colors";
// TODO: このコンポーネント、他の設定項目にも使えるしもうちょっとパブリックにしようや
export default class Description extends Component {
    render() {
        const style = {
            marginLeft:  "24px",
            paddingLeft: "24px",
            borderLeft:  `4px solid ${grey400}`,
        };
        return (
            <blockquote style={style}>{this.props.children}</blockquote>
        );
    }
    static propTypes = {
        children: PropTypes.any.isRequired,
    }
}
