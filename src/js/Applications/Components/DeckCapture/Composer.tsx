import React, { Component } from "react";
import { DeckCaptureLike } from "../../Models/DeckCapture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencilAlt, faForward } from "@fortawesome/free-solid-svg-icons";

export default class ComposerView extends Component<{
  setting: DeckCaptureLike;
  stack: string[];
  push: (blank?: boolean) => void;
  pop: () => void;
  compose: () => Promise<void>;
}> {
  render(): JSX.Element {
    // const {setting} = this.props;
    return (
      <div className="container composer">
        <div className="columns">
          {this.pages()}
        </div>
        <div className="columns">
          {this.getCompleteButton()}
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
    const style = {height: "200px", marginRight: "8px"};
    for (let c = 0; c < this.props.setting.col; c++) {
      const [serial, content] = this.getContentAt(page, row, c);
      cols.push(<div className="column cell" key={serial} style={style}>{content}</div>);
    }
    return cols;
  }

  private getContentAt(page: number, row: number, col: number): [number, JSX.Element] {
    const { setting, stack } = this.props;
    const cellsPerPage = (setting.row * setting.col);
    const serial = (page * cellsPerPage) + (row * setting.col) + col;
    if (serial < stack.length) {
      return [serial, this.getCapturedContent(serial)];
    }
    return [serial, this.getEmptyContent(serial)];
  }

  private getEmptyContent(serial: number): JSX.Element {
    const { stack } = this.props;
    if (stack.length == serial) {
      return (
        <div
          className="cell-content bg-gray focused"
          onClick={() => this.props.push()}
        >
          <FontAwesomeIcon title="切り抜いてここに貼る" icon={faPencilAlt} />
          <div style={{ margin: "18px" }}>
            <FontAwesomeIcon
              title="ここを空白にする" icon={faForward}
              onClick={ev => this.onClickLeaveBlank(ev)}
            />
          </div>
        </div>
      );
    }
    return <div className="cell-content bg-gray"><span className="text-secondary">{serial + 1}</span></div>;
  }

  private getCapturedContent(serial: number): JSX.Element {
    const { stack } = this.props;
    const button = (serial == stack.length - 1) ? <FontAwesomeIcon title="この画像を削除" icon={faTrashAlt} onClick={this.props.pop} /> : null;
    const style = stack[serial] ? { backgroundImage: `url("${stack[serial]}")` } : {};
    return <div key={serial} className="cell-content captured" style={style}>{button}</div>;
  }

  private getCompleteButton(): JSX.Element {
    const { stack } = this.props;
    if (stack.length == 0) {
      return <button className="btn column" disabled>編集ボタンを押して画像を追加してください</button>;
    }
    return <button className="btn btn-primary column" onClick={this.props.compose}>{stack.length}枚の画像をまとめて編成キャプチャをつくる</button>;
  }

  private onClickLeaveBlank(ev: React.MouseEvent) {
    ev.stopPropagation();
    this.props.push(true);
  }
}
