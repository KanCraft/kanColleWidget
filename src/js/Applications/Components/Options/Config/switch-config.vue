<template>
  <div class="column col-10">
    <div class="tile">
      <div class="tile-content">
        <p class="tile-title">{{config.title}}</p>
        <p class="tile-subtitle text-gray">{{config.description}}</p>
      </div>
      <div class="tile-action">
        <div class="form-group">
          <label class="form-switch">
            <input type="checkbox" v-model="config.value" @change="onchange">
            <i class="form-icon"></i>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";

import Config from "../../../Models/Config";

@Component
export default class SwitchConfig extends Vue {

  @Prop({type: Config})
  private config: Config<boolean>;

  onchange(ev: {target: HTMLInputElement}) {
    this.config.update({value: ev.target.checked});
  }

}
</script>
