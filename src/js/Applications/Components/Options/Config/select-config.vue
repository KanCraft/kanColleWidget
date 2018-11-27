<template>
  <div class="column col-10">
    <div class="tile">
      <div class="tile-content">
        <h5 class="tile-title">{{config.title}}</h5>
        <p class="tile-subtitle text-gray">{{config.description}}</p>
      </div>
      <div class="tile-action">
        <div class="form-group">
          <select class="form-select" @change="onchange">
            <option
              v-for="opt in config.options"
              :value="opt.value"
              :key="opt.value"
              :selected="opt.value == config.value"
            >{{opt.name}}</option>
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
    this.config.update({value: ev.target.value});
  }

}
</script>

