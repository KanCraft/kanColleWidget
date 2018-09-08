<template>
  <section class="category">
    <h1>ゲーム画面の設定</h1>
    <config v-bind:config="muteButton" />
    <config v-bind:config="screenshotButton" />
    <config v-bind:config="buttonsPosition" />
  </section>
</template>
<script lang="ts">
import {Vue,Component} from "vue-property-decorator";

import Config, {Category} from "../../Models/Config";
import ConfigView from "./Config/index.vue";

@Component({
  components: {
    "config": ConfigView,
  }
})
export default class InApp extends Vue {

  private buttonsPosition: Config<string>;
  private muteButton: Config<boolean>;
  private screenshotButton: Config<boolean>;

  constructor() {
    super();
    this.buttonsPosition = Config.find("inapp-buttons-position");
    this.muteButton = Config.find("inapp-mute-button");
    this.screenshotButton = Config.find("inapp-screenshot-button");
  }
}
</script>

