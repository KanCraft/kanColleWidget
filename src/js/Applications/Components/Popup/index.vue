<template>
  <div class="container popup" style="width: 320px;">
    <launch-trigger />
    <icon-menu />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LaunchTrigger from "./LaunchTrigger.vue";
import IconMenu from "./IconMenu.vue";

@Component({
  components: {
    "launch-trigger": LaunchTrigger,
    "icon-menu":      IconMenu,
  }
})
export default class Popup extends Vue {
}

</script>