<template>
  <div class="container options">
    <damagesnapshot />
    <category-section title="ゲーム内の便利ボタン" :configs="dictionary['inapp']" />
    <debugger v-if="isDev()" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import DamageSnapshot from "./DamageSnapshot/index.vue";
import CategorySection from "./Config/CategorySection.vue";
import Debugger from "./Debugger/index.vue";

import Config, {Category} from "../../Models/Config";

// webpack.config.jsの、DefinePluginを参照
declare var NODE_ENV;

@Component({
  components: {
    "category-section": CategorySection,
    "damagesnapshot": DamageSnapshot,
    "debugger": Debugger,
  }
})
export default class Options extends Vue {
  private dictionary: {[category in Category]?: Config<any>[]} = {};
  constructor() {
    super();
    Config.list<Config<any>>().map(c => {
      if (this.dictionary[c.category] instanceof Array == false) {
        this.dictionary[c.category] = [];  
      }
      this.dictionary[c.category].push(c);
    });
  }
  private isDev(): boolean {
    return NODE_ENV !== "production";
  }
}

</script>