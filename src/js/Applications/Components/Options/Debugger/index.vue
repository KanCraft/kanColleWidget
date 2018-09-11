<template>
  <div class="category">
    <h1>Dev Debugger</h1>
    <simulator />
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import Simulator from "./Simulator.vue";

@Component({
  components: {
    "simulator": Simulator,
  },
})
export default class Debugger extends Vue {}
</script>
