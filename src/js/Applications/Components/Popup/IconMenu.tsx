import React, { Component } from "react";
import { Client } from "chomex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCog, faGripVertical, faClock, faCamera, faVolumeMute, faVolumeUp, faImages } from "@fortawesome/free-solid-svg-icons";

interface Menu {
  title: string;
  icon: IconProp;
  onClick: () => Promise<unknown>;
}

export default class IconMenu extends Component<{}, {
  menu: Menu[],
}> {
  private client: Client = new Client(chrome.runtime, false);
  constructor(props) {
    super(props);
    this.state = {
      menu: [
        {
          title: "設定",
          icon: faCog,
          onClick: async () => await this.client.message("/options/open"),
        },
        {
          title: "画像アーカイブ",
          icon: faImages,
          onClick: async () => await this.client.message("/archive/open"),
        },
        {
          title: "編成キャプチャ",
          icon: faGripVertical,
          onClick: async () => await this.client.message("/deckcapture/open"),
        },
        {
          title: "ダッシュボード",
          icon: faClock,
          onClick: async () => await this.client.message("/dashboard/open"),
        }
      ],
    };
  }
  async componentDidMount() {
    const res = await this.client.message("/window/current-tab");
    if (res.status != 200) return;
    const tab = res.tab as chrome.tabs.Tab;
    const menu: Menu[] = [...this.state.menu];
    menu.push(
      {
        title: "スクリーンショット", icon: faCamera,
        onClick: async () => await this.client.message("/capture/screenshot", { open: true }),
      },
      {
        title: "ミュート切り替え", icon: tab.mutedInfo.muted ? faVolumeUp : faVolumeMute,
        onClick: async () => await this.client.message("/window/toggle-mute"),
      }
    );
    this.setState({ menu });
  }
  render() {
    const { menu } = this.state;
    return (
      <div className="columns icon-menu">
        {this.viewForMenu(menu)}
      </div>
    );
  }
  private viewForMenu(menu: Menu[]): JSX.Element[] {
    const style = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "4px",
    };
    return menu.map((m, i) => {
      return (
        <div
          key={i}
          className="column col-1"
          style={style}
          data-tooltip={m.title}
          title={m.title}
          onClick={async () => {
            await m.onClick();
            window.close(); // 一応closeしとく
          }}
        >
          <FontAwesomeIcon icon={m.icon} className="clickable" />
        </div>
      );
    });
  }
}
