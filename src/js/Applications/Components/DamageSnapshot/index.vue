<template>
  <div class="container">
    <div
      v-for="(uri, i) in uris"
      :key="i"
      class="cell"
    >
      <img :src="uri" />
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import { Router } from "chomex";

import TempStorage from "../../../Services/TempStorage";

@Component
export default class Capture extends Vue {

  private search: URLSearchParams;
  private count: number;
  private key: string; // drawする画像を間違えないようにするためのkey
  private uris: string[] = [];
  private interval: number;

  constructor() {
    super();
    this.search = new URLSearchParams(location.search);
    this.count = parseInt(this.search.get("count") || "1");
    this.key = this.search.get("key");
    this.interval = setInterval(() => this.renderImage(), 100);
  }

  private renderImage() {
    const temp = new TempStorage();
    const uri = temp.draw(`damagesnapshot_${this.key}`);
    if (!uri) {
      return;
    }
    this.uris.push(uri);
    if (this.uris.length >= this.count) {
      clearInterval(this.interval);
    }
  }

}

</script>

