import React, { Component } from "react";

import DeckCapture from "../../Models/DeckCapture";
import SideBar from "./SideBar";
import SettingModal from "./SettingModal";
import Composer from "./Composer";

export default class DeckCaptureView extends Component<{}, {
  selected: string;        // 今どのせっていが選択されているか
  setting:  DeckCapture;   // 選択されている設定 FIXME: 冗長では？
  settings: DeckCapture[]; // 選択可能なせってい一覧
  row, col, page: number;
  preview: string;
  open: boolean;
}> {
  render() {
    const {
      setting,
      settings,
      selected,
      preview,
      row, col, page,
      open,
    } = this.state;
    return (
      <div className="container root">
        <div className="columns root">
          <div className="column col-3">
            <SideBar
              settings={settings}
              onSelect={ev => this.onSettingChange(ev)}
              selected={selected}
              preview={preview}
              row={row}
              col={col}
              page={page}
            />
            <SettingModal active={open} />
          </div>
          <div className="column col-9">
            <Composer setting={setting} />
          </div>
        </div>
      </div>
    );
  }
  private onSettingChange(ev) {
    const selected = ev.target.value;
    const setting = DeckCapture.find<DeckCapture>(selected);
    this.setState({
      selected,
      setting,
      row:  setting.row,
      col:  setting.col,
      page: setting.page,
    });
  }
}

// </template>
// <script lang="ts">
// import {Vue, Component} from "vue-property-decorator";
// import DeckCapture from "../../Models/DeckCapture";
// import SideBar from "./SideBar.vue";
// import SettingModal from "./SettingModal.vue";
// import Composer from "./Composer.vue";

// import {Client} from "chomex";

// @Component({
//   components: {
//     "side-bar": SideBar,
//     "setting-modal": SettingModal,
//     "composer": Composer,
//   }
// })
// export default class DeckCaptureView extends Vue {

//   private client = new Client(chrome.runtime);

//   private settings: DeckCapture[] = DeckCapture.list<DeckCapture>();
//   private selected: string = "normal";
//   private setting: DeckCapture = DeckCapture.find(this.selected);
//   private open: boolean = false;

//   private row: number = this.setting.row;
//   private col: number = this.setting.col;
//   private page: number = this.setting.page;

//   private preview: string = null;

//   public created() {
//     this.client.message("/capture/screenshot", {open: false}).then(res => {
//       this.preview = res.uri;
//       this.$forceUpdate();
//     }).catch(err => {
//       if (err.status == 404) {
//         alert("ゲーム画面を開いてからリロードしてください");
//       } else {
//         alert(err.status);
//       }
//     });
//   }

//   private onSettingChange(ev: {target: HTMLSelectElement}) {
//     this.selected = ev.target.value;
//     this.setting = DeckCapture.find(this.selected);
//     this.row = this.setting.row;
//     this.col = this.setting.col;
//     this.page = this.setting.page;
//   }
// }

// </script>

