import React, { Component } from "react";
import {Client} from "chomex";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";

export default class IconMenu extends Component {

  render() {
    return (
      <div className="columns" style={{marginTop: "18px"}}>
        {this.viewForMenu()}
      </div>
    );
  }
  private viewForMenu() {
    const style = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "4px",
    };
    return this.menu.map((m, i) => {
      return (
        <div
          key={i}
          className="column col-1"
          style={style}
          data-tooltip={m.title}
          title={m.title}
          onClick={() => m.onClick()}
        >
          <FontAwesomeIcon icon={m.icon} className="clickable" />
        </div>
      );
    });
  }
  private menu = [
    {
      title: "設定",
      icon: "cog" as IconName,
      onClick: async () => {
        const res = await this.client.message("/options/open");
        console.log(res);
      },
    },
    {
      title: "編成キャプチャ",
      icon: "grip-vertical" as IconName,
      onClick: async () => {
        const res = await this.client.message("/deckcapture/open");
        console.log(res);
      },
    }
  ];

  private client: any /* FIXME: Client */ = new Client(chrome.runtime, false);

}
