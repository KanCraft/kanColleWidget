<template>
  <div class="columns">
    <div class="column col-10">
      <div class="form-group">
        <select @change="onselect" class="form-select" style="-webkit-appearance: none;">
          <option
            v-for="frame in frames"
            v-bind:key="frame.id"
            v-bind:value="frame.id"
            :selected="frame.id == selected.id">
            {{frame.alias}}
          </option>
        </select>
      </div>
    </div>
    <div class="column col-2">
      <div
        @click="launch"
        class="icon-justify clickable"
        v-html="icons.browser.toSVG()"
        />
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import * as chomex from "chomex";
import Frame from "../../Models/Frame";

import {browser} from "octicons";

@Component
export default class LaunchTrigger extends Vue {

  private client;
  private frames: Frame[];
  private selected: Frame;
  private icons = {
    browser: browser,
  };

  constructor() {
    super();
    this.client = new chomex.Client(chrome.runtime);
    this.frames = Frame.list<Frame>();
    this.selected = Frame.latest();
  }

  onselect(ev: {target: HTMLInputElement}) {
    this.client.message("/window/open", {id: ev.target.value}).then(() => {
      // FIXME: ここでWindowを参照したくなかった
      window.close();
    });
  }
  launch() {
    this.client.message("/window/open", {id: this.selected._id}).then(() => {
      // FIXME: ここでWindowを参照したくなかった
      window.close();
    });
  }

}
</script>