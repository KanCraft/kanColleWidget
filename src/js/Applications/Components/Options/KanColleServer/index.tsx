import React from "react";
import cn from "classnames";
import KanColleServerSetting, { KanColleServers, KanColleServer } from "../../../Models/Settings/KanColleServerSetting";

export default class KanColleServerSettingView extends React.Component<{}, {
  setting: KanColleServerSetting,
}> {
  constructor(props) {
    super(props);
    this.state = {
      setting: KanColleServerSetting.user(),
    };
  }
  render() {
    const { setting } = this.state;
    const servers = KanColleServers.map(s => ({ ...s, granted: setting.servers.some(g => g.address == s.address) }));
    return (
      <section className="category kancolle-server-setting">
        <h1>鎮守府設定</h1>
        <blockquote className="description">所属の鎮守府サーバを選択してください</blockquote>
        <div className="container">
          <div className="columns">
            {servers.map(server => this.renderServer(server))}
          </div>
        </div>
      </section>
    );
  }
  renderServer(server: KanColleServer) {
    return (
      <div key={server.address}>
        <button
          className={cn("btn", "btn-sm", server.granted ? "btn-primary" : "btn-link", "tooltip", "tooltip-bottom")}
          onClick={() => this.togglePermission(server)}
          data-tooltip={`IP Address: ${server.address}`}
        >{server.name}</button>
      </div>
    );
  }
  async togglePermission(server: KanColleServer) {
    const setting = await (server.granted ? this.state.setting.remove(server) : this.state.setting.add(server));
    this.setState({ setting });
  }
}