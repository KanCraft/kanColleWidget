<template>
  <section>
    <h2>Controller Simulator</h2>
    <div class="columns">
      <div class="column col-12">
        <ul class="tab">
          <li class="tab-item">
            <a href="#"
              v-bind:class="{active: activeTab == 'message'}"
              @click="() => clickTab('message')"
            >Message Controllers</a>
          </li>
          <li class="tab-item">
            <a href="#"
              v-bind:class="{active: activeTab == 'request'}"
              @click="() => clickTab('request')"
            >Request Controllers</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="columns">
      <div class="column col-12">
        <div class="form-group">
          <select class="form-select" @change="changeController">
            <option
              v-for="name in controllers[activeTab]"
              v-bind:key="name"
              v-bind:selected="name == activeController"
            >{{name}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column col-6 col-sm-12">
        <h3>{{activeTab}} body</h3>
        <pre class="code" data-lang="JSON"><code contenteditable="true" @input="onBodyChange">{
  "__this": {
    "sender": {}
  }
}</code></pre>
      </div>
      <div class="column col-6 col-sm-12">
        <h3>response</h3>
        <pre class="code" data-lang="JSON"><code>{{response}}</code></pre>
      </div>
    </div>
    <div class="columns">
      <div class="column col-12">
        <button class="btn btn-primary btn-block" v-bind:class="{disabled: !!error}" @click="execute">Execute</button>
        <span class="error" v-if="!!error">{{error}}</span>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import {Client} from "chomex";

// JSのサイズ大きくなるしやめよか
// import * as WindowController from "../../../Background/Controllers/Window";

@Component
export default class Simulator extends Vue {

  private controllers = {
    message: [
      "WindowOpen",
      "Screenshot",
      "DamageSnapshotCapture",
    ],
    request: [
      "OnBattleStarted",
    ],
  };

  private activeTab: string = "message";
  private activeController: string = this.controllers[this.activeTab][0];

  private body: any = {__this: {sender: {}}};
  private error?: string = null;
  private response: string;

  private clickTab(tab: string) {
    this.activeTab = tab;
    this.activeController = this.controllers[this.activeTab][0];
  }
  private changeController(ev: {target: HTMLSelectElement}) {
    this.activeController = ev.target.value;
  }

  private onBodyChange(ev: {target: HTMLElement}) {
    try {
      this.body = JSON.parse(ev.target.innerText);
      this.error = null;
    } catch (err) {
      this.error = err.message;
    }
  }

  private async execute() {
    const client = new Client(chrome.runtime, false);
    const res = await client.message("/debug/controller", {
      __controller: this.activeController,
      ...this.body,
    });
    this.response = JSON.stringify(res, null, 2);
    this.$forceUpdate(); // FIXME:
  }
}
</script>
