<template>
  <div class="container options">
    <in-app />
    <debugger v-if="isDev()" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import InApp from "./InApp.vue";
import Debugger from "./Debugger/index.vue";

// webpack.config.jsの、DefinePluginを参照
declare var NODE_ENV;

@Component({
  components: {
    "in-app": InApp,
    "debugger": Debugger,
  }
})
export default class Options extends Vue {

  private isDev(): boolean {
    return NODE_ENV !== "production";
  }

}

</script>