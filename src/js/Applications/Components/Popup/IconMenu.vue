<template>
  <div class="columns" style="margin-top: 18px;">
    <template v-for="(m, i) in menu">
      <div
        class="column col-1"
        v-bind:data-tooltip="m.title"
        v-bind:title="m.title"
        v-html="m.icon.toSVG({width: '24px', class: 'clickable'})"
        v-bind:key="i"
        @click="m.onClick()"
      />
    </template>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import {gear} from "octicons";
import {Client} from "chomex";

@Component
export default class IconMenu extends Vue {

  private client: any /* FIXME: Client */ = new Client(chrome.runtime);

  private menu = [
    {
      title: "設定",
      icon: gear,
      onClick: async () => {
        const res = await this.client.message("/options/open");
        console.log(res);
      },
    }
  ];

}
</script>

