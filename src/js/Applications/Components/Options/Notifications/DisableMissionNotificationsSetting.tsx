import React from "react";
import DisableMissionNotificationSetting from "../../../Models/Settings/DisableMissionNotificationSetting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import missionCatalog from "../../../Models/Queue/missions";
import Mission from "../../../Models/Queue/Mission";
import ResetButton from "../ResetButton";

interface mission {
  id: number | string,// numberにしたいが、../../../Models/Queue/Mission.id からキャストするため、同一の型である必要がある
  title: string
}

const UNKNOWN_MISSION_LABEL = "知らない子ですね...";
const UNKNOWN_MISSION_ID = 0;

class DisableMissionNotificationCreator extends React.Component <{
  done: () => void;
}, {
  missions: mission[]
  missionId: number,
}> {
  constructor(props) {
    super(props);
    const missions = Object
      .keys(missionCatalog)
      .filter(id => parseInt(id) > 0)
      .map(id => Mission.for(parseInt(id), 0));
    this.state = {
      missionId: 0,
      missions: missions
    };
  }

  render() {
    const { missionId, missions } = this.state;
    const mission = Mission.for(missionId, 0);
    const selectedMissionId = mission ? missionId : UNKNOWN_MISSION_ID;

    return (
      <div className="columns column col-12">
        <div className="column col-10">
          遠征<select value={selectedMissionId} onChange={(ev) => this.onChange(ev)}>
            <option value={UNKNOWN_MISSION_ID}>{UNKNOWN_MISSION_LABEL}</option>
            {missions.map(mission => (<option key={mission.id} value={mission.id}>{mission.title}</option>))}
          </select>
         ID<input type="number" value={this.state.missionId} onChange={(ev) => this.onChange(ev)}/>
        </div>
        <div className="column col-2">
          <button key={0} className="btn btn-sm btn-primary float-right" title="保存" onClick={() => this.onClickSave()}><FontAwesomeIcon icon={faCheck} /></button>,
          <button key={1} className="btn btn-sm btn-error float-right" title="削除" onClick={() => this.props.done()}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>
      </div>
    );
  }

  onChange(ev): void {
    this.setState({
      missionId: ev.target.value
    });
  }

  onClickSave(): void {
    const { missionId } = this.state;
    const setting = DisableMissionNotificationSetting.new({ _id: missionId.toString() });
    setting.save();
    this.props.done();
  }
}

class DisableMissionNotificationEditor extends React.Component <{
  done: () => void;
  setting: DisableMissionNotificationSetting;
}> {
  render() {
    return (
      <div className="columns column col-12">
        <div className="column col-10">{ this.getMissionTitle() }</div>
        <div className="column col-2">
          <button className="btn btn-sm btn-link float-right" title="削除" onClick={() => this.onClickDelete()}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>
      </div>
    );
  }

  getMissionTitle(): string {
    const { setting } = this.props;
    const mission = Mission.for(setting._id, 0);

    if (parseInt(setting._id) <= 0 || !mission) {
      return `${UNKNOWN_MISSION_LABEL}（ID：${setting._id}）`;
    }

    return mission.title;
  }

  onClickDelete(): void {
    const { setting } = this.props;

    const title = this.getMissionTitle();
    const isAccepted = window.confirm(`以下の非通知遠征を削除してもいいですか？\n\n${title}`);
    if (!isAccepted) {
      return;
    }

    setting.delete();
    this.props.done();
  }
}

export default class DisableMissionNotificationSettingView extends React.Component <{}, {
  settings: DisableMissionNotificationSetting[];
  addMode: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = {
      settings: DisableMissionNotificationSetting.list(),
      addMode: false
    };
  }
  render() {
    const { settings, addMode } = this.state;
    return (
      <section className="category notification-setting">
        <div className={"container"}>
          <div className="columns">
            <div className="column col-12">
              <h5>非通知遠征 <ResetButton models={[DisableMissionNotificationSetting]}/></h5>
              <blockquote className="description text-gray">遠征に出した際に通知を行わない遠征を設定できます。<br />新しい遠征で、艦これウィジェットの更新が追いついていない場合はIDを入力できます。（詳しくは<a href="https://github.com/KanCraft/kanColleWidget/wiki/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9#%E9%81%A0%E5%BE%81%E7%B5%82%E4%BA%86%E9%80%9A%E7%9F%A5">マニュアル</a>へ）</blockquote>
            </div>
            {
              settings.map((setting) =>
                <DisableMissionNotificationEditor key={setting._id} done={() => this.refresh()} setting={setting}/>
              )
            }
            {
              addMode ?
                <DisableMissionNotificationCreator key={"new"} done={() => this.refresh()}/>
                :
                <div className="columns col-12 add-btn-wrapper">
                  <div className="column"></div>
                  <div className="column col-auto">
                    <button className="btn btn-sm add-btn" onClick={() => this.setState({ addMode: true })}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
            }
          </div>
        </div>
      </section>
    );
  }

  refresh() {
    this.setState({
      settings: DisableMissionNotificationSetting.list(),
      addMode: false
    });
  }
}