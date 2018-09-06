<template>
  <div class="container options">
    <debugger v-if="isDev()" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Debugger from "./Debugger.vue";

// webpack.config.jsの、DefinePluginを参照
declare var NODE_ENV;

@Component({
  components: {
    debugger: Debugger,
  }
})
export default class Options extends Vue {

  private isDev(): boolean {
    return NODE_ENV !== "production";
  }

}

</script>