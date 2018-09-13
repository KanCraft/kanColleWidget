<template>
  <div class="container">
    <h1>スクショ</h1>
    <div class="columns">
      <div v-for="(uri, i) in uris" v-bind:key="i" class="column col-4 col-sm-6">
        <img v-bind:src="uri" style="width: 100%;" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import { Router } from "chomex";

@Component
export default class Capture extends Vue {

  private uris: string[] = [];

  constructor() {
    super();
    const router = new Router(); 
    router.on("/capture/show", (message) => this.showImage(message.uri));
    // FIXME: ここでchromeを参照したくないんだよなあ
    chrome.runtime.onMessage.addListener(router.listener());
  }

  private showImage(uri: string) {
    this.uris.push(uri);
  }
}

</script>

