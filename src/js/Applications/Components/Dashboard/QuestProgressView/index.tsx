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
}> {
  render() {
    const { progress } = this.props;
    return (
      <div className="container quest-progress">
        {Object.values(progress.quests).filter(q => q.status != Status.Unavailable).sort(this.questSortFunc).map(quest => {
          return (
            <div className="columns" key={quest.id}>
              <div className="column col-auto">
                <span className={`label label-rounded ${quest.category}`}>{quest.id}</span>
              </div>
              <div className="column quest-title">{quest.title}</div>
              <div className="column col-auto">
                <span className={`status label ${quest.status}`}>{this.getStatusText(quest)}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  questSortFunc(prev: Quest, next: Quest) {
    return sortmap[prev.status] < sortmap[next.status] ? -1 : 1;
  }
  getStatusText(quest: Quest): string {
    switch (quest.status) {
    case Status.Open: return "未着手";
    case Status.Ongoing: return "遂行中";
    case Status.Completed: return "達成";
    }
  }
}