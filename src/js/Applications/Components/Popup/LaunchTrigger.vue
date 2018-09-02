<template>
  <div class="columns">
    <div class="column col-10">
      <div class="form-group">
        <select @change="onselect" class="form-select" style="-webkit-appearance: none;">
          <option value="s">小型</option>
          <option value="m">中型</option>
          <option value="l">大型</option>
        </select>
      </div>
    </div>
    <div class="column col-2">
      <div @click="launch" class="icon-justify clickable">
        <compass class="fill-primary" width="28px" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import Icons from "../Icons";

import * as chomex from "chomex";

@Component({
  components: {
    compass: Icons.compass,
  }
})
export default class LaunchTrigger extends Vue {

  private client;

  constructor() {
    super();
    this.client = new chomex.Client(chrome.runtime);
  }
  onselect(ev: {target: HTMLInputElement}) {
    this.client.message("/window/open");
  }
  launch() {
    this.client.message("/window/open");
  }
}
</script>