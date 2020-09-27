import React from "react";
import { QuestProgress, Quest } from "../../../Models/Quest";
import { Group, Status } from "../../../Models/Quest/consts";
import cn from "classnames";

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
  groups: { [group: string]: boolean },
}> {
  constructor(props) {
    super(props);
    this.state = {
      manual: null,
      groups: { [Group.Daily]: true, [Group.Weekly]: true },
    };
  }
  render() {
    const { progress } = this.props;
    return (
      <div className="container quest-progress">
        <div className="columns">
          <div className="column col-auto btn-group btn-group-block btn-filters">
            {[Group.Daily, Group.Weekly].map(group => this.renderGroupFilter(group))}
          </div>
        </div>
        {this.getQuests(progress).map(quest => {
          return (
            <div className="columns" key={quest.id}>
              <div className="column col-auto">
                <span className={`label label-rounded ${quest.category}`}>{quest.id}</span>
              </div>
              <div className="column quest-title">{quest.title}</div>
              <div className="column col-auto">
                <span
                  className={`c-hand status label ${quest.status}`}
                  onClick={() => this.onClickStatus(quest)}
                >{this.getStatusText(quest.status)}</span>
              </div>
            </div>
          );
        })}
        {this.state.manual ? this.renderModal() : null}
      </div>
    );
  }
  renderGroupFilter(group: Group) {
    const enabled = this.state.groups[group];
    const className = cn("btn", "btn-sm", enabled ? "btn-primary" : "btn-link");
    const onClick = () => this.setState({ groups: { ...this.state.groups, [group]: !this.state.groups[group] } });
    return <button key={group} className={className} onClick={onClick}>{group}</button>;
  }
  getQuests(progress: QuestProgress): Quest[] {
    return Object.values(progress.quests)
      .filter(this.questFilterFunc.bind(this))
      .sort(this.questSortFunc);
  }
  onClickStatus(quest: Quest) {
    if (quest.status == Status.Completed) {
      this.props.progress.hide(quest.id);
    } else {
      this.setState({ manual: quest });
    }
  }
  questFilterFunc(quest: Quest): boolean {
    if (!quest.visible) return false;
    if (!this.state.groups[quest.group]) return false;
    return true;
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