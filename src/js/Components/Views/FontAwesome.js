import React, {Component, PropTypes} from "react";

export default class Icon extends Component {
    render() {
        const clss = this.getClassName();
    // TODO: いろいろ
        return <i className={clss} style={{fontSize: this.props.size}}/>;
    }
    getClassName() {
        let clss = `fa fa-${this.props.name || "question"}`;
        return clss;
    }
    static propTypes = {
        size: PropTypes.number,
        name: PropTypes.string
    }
}
