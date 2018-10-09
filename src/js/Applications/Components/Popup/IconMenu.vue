<template>
  <div class="columns" style="margin-top: 18px;">
    <template v-for="(m, i) in menu">
      <div
        class="column col-2"
        style="display: flex; align-items: center; justify-content: center; margin-bottom: 4px;"
        v-bind:data-tooltip="m.title"
        v-bind:title="m.title"
        v-html="m.icon.toSVG({width: '22px', class: 'clickable'})"
        v-bind:key="i"
        @click="m.onClick()"
      />
    </template>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import octicons from "octicons";
import {Client} from "chomex";

@Component
export default class IconMenu extends Vue {

  private client: any /* FIXME: Client */ = new Client(chrome.runtime, false);

  private menu = [
    {
      title: "設定",
      icon: octicons["gear"],
      onClick: async () => {
        const res = await this.client.message("/options/open");
        console.log(res);
      },
    },
    {
      title: "編成キャプチャ",
      icon: octicons["list-ordered"],
      onClick: async () => {
        const res = await this.client.message("/deckcapture/open");
        console.log(res);
      },
    }
  ];

}
</script>

