<template>
  <div class="columns">
    <div class="column col-10">
      <div class="form-group">
        <select class="form-select" style="-webkit-appearance: none;">
          <option>大型</option>
          <option>中型</option>
          <option>小型</option>
        </select>
      </div>
    </div>
    <div class="column col-2">
      <div class="icon-justify clickable">
        <!-- <img class="popup-icon" src="/dest/img/icons/compass.svg" /> -->
        <compass class="fill-primary" width="28px" />
      </div>
      <!-- <button class="btn btn-action"><i class="icon icon-arrow-right"></i></button> -->
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import Compass from "../Icons/compass.vue";

@Component({
  components: {
    compass: Compass,
  }
})
export default class LaunchTrigger extends Vue {

}
</script>