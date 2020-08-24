import React from "react";
import { QuestProgress, Quest } from "../../../Models/Quest";
import { Status } from "../../../Models/Quest/consts";

const sortmap: { [status: string]: number } = {
  [Status.Open]: 0,
  [Status.Ongoing]: 1,
  [Status.Completed]: 2,
  [Status.Unavailable]: 3,
};

export default class QuestProgressView extends React.Component<{
  progress: QuestProgress,
}, {
  manual: Quest,
}> {
  constructor(props) {
    super(props);
    this.state = { manual: null };
  }
  render() {
    const { progress } = this.props;
    return (
      <div className="container quest-progress">
        {Object.values(progress.quests).filter(q => q.visible).sort(this.questSortFunc).map(quest => {
          return (
            <div className="columns" key={quest.id}>
              <div className="column col-auto">
                <span className={`label label-rounded ${quest.category}`}>{quest.id}</span>
              </div>
              <div className="column quest-title">{quest.title}</div>
              <div className="column col-auto">
                <span
                  className={`c-hand status label ${quest.status}`}
                  onClick={() => this.setState({ manual: quest })}
                >{this.getStatusText(quest.status)}</span>
              </div>
            </div>
          );
        })}
        {this.state.manual ? this.renderModal() : null}
      </div>
    );
  }
  questSortFunc(prev: Quest, next: Quest): number {
    return sortmap[prev.status] < sortmap[next.status] ? -1 : 1;
  }
  getStatusText(status: Status): string {
    switch (status) {
    case Status.Open: return "未着手";
    case Status.Ongoing: return "遂行中";
    case Status.Completed: return "達成";
    }
  }
  private renderModal() {
    const quest = this.state.manual;
    const progress = this.props.progress;
    return (
      <div className="modal modal-sm active quest-progress-manual">
        <a className="modal-overlay" onClick={() => this.setState({ manual: null })} />
        <div className="modal-container">
          <div className="modal-header">
            <div className="modal-title h5">{quest.title}</div>
          </div>
          <div className="modal-footer container">
            <div className="columns">
              <div className="column">
                <button className={`btn ${Status.Open}`} onClick={() => progress.stop(quest.id) && this.closeModal()}>{this.getStatusText(Status.Open)}</button>
              </div>
              <div className="column">
                <button className={`btn ${Status.Ongoing}`} onClick={() => progress.start(quest.id) && this.closeModal()}>{this.getStatusText(Status.Ongoing)}</button>
              </div>
              <div className="column">
                <button className={`btn ${Status.Completed}`} onClick={() => progress.complete(quest.id) && this.closeModal()}>{this.getStatusText(Status.Completed)}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  private closeModal() {
    this.setState({ manual: null });
  }
}