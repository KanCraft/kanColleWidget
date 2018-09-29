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
import { Client } from "chomex";

import TempStorage from "../../../Services/TempStorage";

@Component
export default class Capture extends Vue {

  private search: URLSearchParams;
  private count: number;
  private key: string; // drawする画像を間違えないようにするためのkey
  private uris: string[] = [];
  private observe: number;
  private record: number;
  private client: any;

  constructor() {
    super();
    this.search = new URLSearchParams(location.search);
    this.count = parseInt(this.search.get("count") || "1");
    this.key = this.search.get("key");
    this.observe = setInterval(() => this.renderImage(), 100);
    this.record = setInterval(() => this.recordFrame(),  2000);
    this.client = new Client(chrome.runtime);
  }

  /**
   * ローカルストレージを監視し、自分のkeyでuriが保存されたら、
   * それを引き出して表示する。
   * 初期化で使われた "count" に至れば、もうこれ以上同じことはしない。
   */
  private renderImage() {
    const temp = new TempStorage();
    const uri = temp.draw(`damagesnapshot_${this.key}`);
    if (!uri) {
      return;
    }
    this.uris.push(uri);
    if (this.uris.length >= this.count) {
      clearInterval(this.observe);
    }
  }

  private recordFrame() {
    this.client.message("/snapshot/record", {
      position: { left: window.screenLeft, top: window.screenTop },
      size: { height: window.innerHeight },
    });
  }

}

</script>

