<template>
  <div class="container">
    <div class="columns">
      <div class="column col-4 col-sm-6">
        <img v-bind:src="uri" style="width: 100%;" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import { Router } from "chomex";

import TempStorage from "../../../Services/TempStorage";

@Component
export default class Capture extends Vue {

  private uri: string;

  constructor() {
    super();
    /**
     * 当初は、capture.htmlで chrome.runtime.onMessage を listen しようとしたが、
     * Chrome拡張ドメイン（chrome-extension://{ext_id}）において複数 runtime.onMessage
     * を listen すると、あとから addListener された リスナーが有効になるため、
     * content_script からの sendMessage が not found になるケースが増える。
     * したがって、capture.html において image uri を取得するのは、runtime.onMessage以外の
     * 方法であるべきである。
     */
    // const router = new Router();
    // router.on("/capture/show", (message) => this.showImage(message.uri));
    // chrome.runtime.onMessage.addListener(router.listener());

    const key = (new URLSearchParams(location.search)).get("key");
    const temp = new TempStorage();
    this.uri = temp.draw(key);
  }

}

</script>

