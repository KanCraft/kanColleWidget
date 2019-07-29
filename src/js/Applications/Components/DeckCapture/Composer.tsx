import React, { Component } from "react";
import DeckCapture from "../../Models/DeckCapture";

export default class ComposerView extends Component<{
    setting: DeckCapture;
}> {
    render() {
        // const {setting} = this.props;
        return (
            <div className="container composer">
                <div className="columns">
                    {this.pages()}
                </div>
            </div>
        );
    }

    private pages(): JSX.Element[] {
        const pages: JSX.Element[] = [];
        for (let p = 0; p < this.props.setting.page; p++) {
            pages.push(<div className="column" key={p}>{this.rows(p)}</div>);
        }
        return pages;
    }
    private rows(page: number): JSX.Element[] {
        const rows: JSX.Element[] = [];
        const style = {marginBottom: "8px"};
        for (let r = 0; r < this.props.setting.row; r++) {
            rows.push(<div className="columns" key={r} style={style}>{this.cols(page, r)}</div>);
        }
        return rows;
    }
    private cols(page: number, row: number): JSX.Element[] {
        const cols: JSX.Element[] = [];
        const style = {height: "200px", backgroundColor: "#bfbfdf", marginRight: "8px"};
        for (let c = 0; c < this.props.setting.col; c++) {
            const index: number = this.props.setting.col * row + c + 1;
            cols.push(<div className="column" key={index} style={style}>{index}</div>);
        }
        return cols;
    }
}
