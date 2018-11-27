<template>
  <div class="column col-10">
    <div class="tile">
      <div class="tile-content">
        <h5 class="tile-title">{{config.title}}</h5>
        <p class="tile-subtitle text-gray">{{config.description}}</p>
      </div>
      <div class="tile-action">
        <div class="form-group">
          <input
            @change="onchange"
            class="form-input"
            type="number"
            :value="config.value"
            :step="config.step"
            :min="config.range[0]"
            :max="config.range[1]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";
import Config from "../../../Models/Config";

@Component
export default class NumberConfig extends Vue {
  @Prop({type: Config}) private config: Config<number>;
  onchange(ev: {target: HTMLInputElement}) {
    this.config.update({value: parseInt(ev.target.value)});
  }
}
</script>

