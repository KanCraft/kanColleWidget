<template>
  <div class="container root">
    <div class="columns root">
      <div class="column col-3">
        <side-bar
          :settings="settings"
          :onSelect="onSettingChange"
          :selected="selected"

          :preview="preview"

          :row="row"
          :col="col"
          :page="page"
        />
        <setting-modal
          :active="open"
        />
      </div>
      <div class="column col-9">
        <composer
          :setting="setting"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import DeckCapture from "../../Models/DeckCapture";
import SideBar from "./SideBar.vue";
import SettingModal from "./SettingModal.vue";
import Composer from "./Composer.vue";

import {Client} from "chomex";

@Component({
  components: {
    "side-bar": SideBar,
    "setting-modal": SettingModal,
    "composer": Composer,
  }
})
export default class DeckCaptureView extends Vue {

  private client = new Client(chrome.runtime);

  private settings: DeckCapture[] = DeckCapture.list<DeckCapture>();
  private selected: string = "normal";
  private setting: DeckCapture = DeckCapture.find(this.selected);
  private open: boolean = false;

  private row: number = this.setting.row;
  private col: number = this.setting.col;
  private page: number = this.setting.page;

  private preview: string = null;

  public created() {
    this.client.message("/capture/screenshot", {open: false}).then(res => {
      this.preview = res.uri;
      this.$forceUpdate();
    }).catch(err => {
      if (err.status == 404) {
        alert("ゲーム画面を開いてからリロードしてください");
      } else {
        alert(err.status);
      }
    });
  }

  private onSettingChange(ev: {target: HTMLSelectElement}) {
    this.selected = ev.target.value;
    this.setting = DeckCapture.find(this.selected);
    this.row = this.setting.row;
    this.col = this.setting.col;
    this.page = this.setting.page;
  }
}

</script>

