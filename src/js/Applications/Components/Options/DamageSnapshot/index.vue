<template>
  <section class="category">
    <h1>大破進撃防止機能</h1>
    <config v-bind:config="damagesnapshot" />
    <config v-if="damagesnapshot.value == 'inapp'" :config="inappdsnapshotsize" />
    <config v-if="damagesnapshot.value != 'disabled'" v-bind:config="inappdsnapshotctx" />
  </section>
</template>
<script lang="ts">
import {Vue,Component} from "vue-property-decorator";

import Config, {Category} from "../../../Models/Config";
import ConfigView from "../Config/index.vue";
import DamageSnapshotFrame from "../../../Models/DamageSnapshotFrame";

@Component({
  components: {"config": ConfigView},
})
export default class InApp extends Vue {

  private damagesnapshot: DamageSnapshotFrame;
  private inappdsnapshotsize: Config<number>;
  private inappdsnapshotctx: Config<boolean>;

  constructor() {
    super();
    this.damagesnapshot = DamageSnapshotFrame.get();
    this.inappdsnapshotsize = Config.find("inapp-dsnapshot-size");
    this.inappdsnapshotctx = Config.find("inapp-dsnapshot-context");
  }
}
</script>
