<template>
  <div class="container popup" style="width: 320px;">
    <launch-trigger />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LaunchTrigger from "./LaunchTrigger.vue";

@Component({
  components: {
    "launch-trigger": LaunchTrigger,
  }
})
export default class Popup extends Vue {
  foobar() {
    alert("hogeeeee");
  }
}

</script>