import React, { Component } from "react";
import Config from "../../../Models/Config";

export default class SelectConfig extends Component<{config: Config<any>}, {timestamp: number}> {
    private onChange(ev) {
        this.props.config.update({value: ev.target.value});
        this.setState({ timestamp: Date.now() });
    }
    render() {
        const {
            config
        } = this.props;
        return (
            <div className="column col-10">
                <div className="tile">
                    <div className="tile-content">
                        <h5 className="tile-title">{config.title}</h5>
                        <p className="tile-subtitle text-gray">{config.description}</p>
                    </div>
                    <div className="tile-action">
                        <div className="form-group">
                            <select
                                value={config.value}
                                className="form-select" onChange={ev => this.onChange(ev)}>
                                {config.options.map(opt => {
                                    return (
                                        <option
                                            value={opt.value}
                                            key={opt.value}
                                        >{opt.name}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
