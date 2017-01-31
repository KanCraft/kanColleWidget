import React, {Component, PropTypes} from "react";
import RaisedButton from "material-ui/RaisedButton";
import Settings from "material-ui/svg-icons/action/settings";
import Add      from "material-ui/svg-icons/content/add";

// App
import Frame from "../../../Models/Frame";

// Partials
import WinconfigView     from "./WinconfigView";
import WinconfigFormView from "./WinconfigFormView";

export default class WinconfigsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frames: Frame.all(),
            showAddForm: false
        };
    }
    toggleAddForm() {
        this.setState({showAddForm: !this.state.showAddForm});
    }
    render() {
        const frames = Object.keys(this.state.frames).map(id => {
            return <WinconfigView key={id} frame={this.state.frames[id]} />;
        });
        return (
          <div>
            <h1 style={this.props.styles.title}><Settings /> 窓設定</h1>
            <div>
              {frames}
              {(this.state.showAddForm) ?  <WinconfigFormView
                toggleAddForm={this.toggleAddForm.bind(this)}
              /> : null }
              {(this.state.showAddForm) ? null : <RaisedButton
                onClick={this.toggleAddForm.bind(this)}
                icon={<Add />}
                label="ADD"
              />}
            </div>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired
    }
}
