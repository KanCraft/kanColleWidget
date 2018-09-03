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
      <div @click="launch" class="icon-justify clickable">
        <compass class="fill-primary" width="28px" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import * as chomex from "chomex";
import Icons from "../Icons";
import Frame from "../../Background/Models/Frame";

@Component({
  components: {
    compass: Icons.compass,
  }
})
export default class LaunchTrigger extends Vue {

  private client;
  private frames: Frame[];
  private selected: Frame;

  constructor() {
    super();
    this.client = new chomex.Client(chrome.runtime);
    this.frames = Frame.list<Frame>();
    this.selected = Frame.latest();
  }

  onselect(ev: {target: HTMLInputElement}) {
    this.client.message("/window/open", {id: ev.target.value});
  }
  launch() {
    this.client.message("/window/open", {id: this.selected._id});
  }

}
</script>