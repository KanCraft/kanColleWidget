import React from "react";
import DisableMissionNotificationSetting from "../../../Models/Settings/DisableMissionNotificationSetting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheck, faPlus, faExpandArrowsAlt, faCompressArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import missionCatalog from "../../../Models/Queue/missions";
import ResetButton from "../ResetButton";

interface mission {
  id: number,
  title: string
}

const UNKNOWN_MISSION_LABEL = "知らない子ですね...";
const UNKNOWN_MISSION_ID = 0;

class DisableMissionNotificationEditor extends React.Component <{
  done: () => void;
  setting: DisableMissionNotificationSetting | null;
}, {
  setting: DisableMissionNotificationSetting;
  missionId: number,
  editMode: boolean;
  missions: mission[]
}> {
  constructor(props) {
    super(props);
    const setting: DisableMissionNotificationSetting = props.setting || DisableMissionNotificationSetting.new({ _id: 0 });
    const missions = Object
      .keys(missionCatalog)
      .filter(id => parseInt(id) > 0)
      .map(id => {
        return {
          "title": missionCatalog[id]["title"],
          "id": parseInt(id)
        };
      });
    this.state = {
      setting: setting,
      missionId: parseInt(setting._id),
      editMode: props.setting === null,
      missions: missions
    };
  }
  render() {
    const { editMode, missions } = this.state;
    return (
      <div className="columns column col-12">
        {editMode ?
          <div className="column col-10">
            遠征<select value={this.getSelectedMission().id} onChange={(ev) => this.onChange(ev)}>
              <option value={UNKNOWN_MISSION_ID}>{UNKNOWN_MISSION_LABEL}</option>
              {missions.map(mission => (<option key={mission.id} value={mission.id}>{mission.title}</option>))}
            </select>
            ID<input type="number" value={this.state.missionId} onChange={(ev) => this.onChange(ev)}/>
          </div> : <div className="column col-10">{this.getSelectedMissionTitle()}</div>
        }
        <div className="column col-2">
          {editMode ? [
            <button key={0} className="btn btn-sm btn-primary float-right" title="保存" onClick={() => this.onClickSave()}><FontAwesomeIcon icon={faCheck} /></button>,
            <button key={1} className="btn btn-sm btn-error float-right" title="削除" onClick={() => this.onClickDelete()}><FontAwesomeIcon icon={faTrashAlt} /></button>
          ] : <button className="btn btn-sm btn-link float-right" title="削除" onClick={() => this.onClickDelete()}><FontAwesomeIcon icon={faTrashAlt} /></button>}
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
    const { setting, missionId } = this.state;
    setting._id = missionId.toString();
    setting.save();
    this.done();
  }

  onClickDelete(): void {
    const { setting } = this.state;
    if (!setting._id) {
      this.props.done();
      return;
    }

    const title = this.getSelectedMissionTitle();
    const isAccepted = window.confirm(`以下の非通知遠征を削除してもいいですか？\n\n${title}`);
    if (!isAccepted) {
      return;
    }

    setting.delete();
    this.done();
  }

  done(): void {
    this.setState({
      editMode: false
    });
    this.props.done();
  }

  getSelectedMission(): mission {
    const { missions, missionId } = this.state;
    const mission = missions.find(mission => mission.id == missionId);
    if (mission) {
      return mission;
    }
    return {
      "title": UNKNOWN_MISSION_LABEL,
      "id": UNKNOWN_MISSION_ID
    };
  }

  getSelectedMissionTitle(): string {
    const mission = this.getSelectedMission();
    if (mission.id === UNKNOWN_MISSION_ID) {
      const { missionId } = this.state;
      return `${mission.title}（ID：${missionId}）`;
    }
    return mission.title;
  }
}

class UnknownMissionHelp extends React.Component <{}, {
  isOpen: boolean
}> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  render() {
    const { isOpen } = this.state;

    return (
      <div className="columns column col-12">
        <div className="column col-12">
          {isOpen ?
            <button className="btn btn-sm" onClick={() => this.close()}><FontAwesomeIcon icon={faCompressArrowsAlt}/></button>
            : <button className="btn btn-sm"  onClick={() => this.open()}><FontAwesomeIcon icon={faExpandArrowsAlt}/></button>
          }
        </div>
        {this.renderImage()}
      </div>
    );
  }

  renderImage() {
    const { isOpen } = this.state;
    const imageSrc = chrome.extension.getURL("dest/img/unknown-mission-help.png");
    return isOpen ? (<img src={imageSrc} />) : ("");
  }

  open(): void {
    this.setState({
      isOpen: true
    });
  }

  close(): void {
    this.setState({
      isOpen: false
    });
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
              <blockquote className="description text-gray">遠征に出した際に通知を行わない遠征を設定できます。<br />新しい遠征で、艦これウィジェットの更新が追いついていない場合はIDを入力できます。（折り畳みの画像を参照）</blockquote>
            </div>
            <UnknownMissionHelp />
            {
              settings.map((setting) =>
                <DisableMissionNotificationEditor key={setting._id} done={() => this.refresh()} setting={setting}/>
              )
            }
            {
              addMode ?
                <DisableMissionNotificationEditor key={"new"} done={() => this.refresh()} setting={null}/>
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