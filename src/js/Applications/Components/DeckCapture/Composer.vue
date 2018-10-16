<template>
  <div class="container composer">
    <div class="columns">
      <div v-for="p in setting.page" :key="p" class="column">
        <div
          v-for="i in setting.row"
          :key="i"
          class="columns"
          style="margin-bottom: 8px;"
        >
        <div
          v-for="j in setting.col"
          :key="j"
          style="width: 120px; height: 120px; background-color: #bfbfdf; margin-right: 8px;"
        />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";
import DeckCapture from "../../Models/DeckCapture";

@Component
export default class ComposerView extends Vue {
  @Prop() private setting: DeckCapture;
}
</script>

