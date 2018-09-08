<template>
  <div class="column col-10">
    <div class="tile">
      <div class="tile-content">
        <p class="tile-title">{{config.title}}</p>
        <p class="tile-subtitle text-gray">{{config.description}}</p>
      </div>
      <div class="tile-action">
        <div class="form-group">
          <select class="form-select">
            <option v-for="opt in config.options" v-bind:key="opt.value">{{opt.name}}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";
import Config from "../../../Models/Config";

@Component
export default class SelectConfig extends Vue {

  @Prop({type: Config})
  private config: Config<string>;

  onchange(ev: {target: HTMLInputElement}) {
    this.config.update({value: ev.target.checked});
  }

}
</script>

