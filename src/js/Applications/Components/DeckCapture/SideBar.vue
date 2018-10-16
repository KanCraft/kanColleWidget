<template>
  <div class="container sidebar">

    <div class="form-group">
      <select class="form-select" @change="onSelect">
        <option
          v-for="s in settings"
          :key="s.title"
          :value="s._id"
          :selected="selected == s._id"
        >{{s.title}}</option>
      </select>
    </div>

    <div class="preview-container">
      <div id="preview">
        <img v-bind:src="preview" style="width: 100%; display: block;"/>
      </div>
    </div>

    <div class="input-group">
      <input type="number" class="form-input" :value="row">
      <span class="input-group-addon">行</span>
    </div>

    <div class="input-group">
      <input type="number" class="form-input" :value="col">
      <span class="input-group-addon">列</span>
    </div>

    <div class="input-group">
      <input type="number" class="form-input" :value="page">
      <span class="input-group-addon">ページ</span>
    </div>

  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";
import DeckCapture from "../../Models/DeckCapture";

@Component
export default class SideBar extends Vue {
  @Prop() private settings: DeckCapture[];
  @Prop() private selected: string;
  @Prop() private onSelect: (DeckCapture) => any;

  @Prop() private preview: string;

  @Prop() private row: number;
  @Prop() private col: number;
  @Prop() private page  : number;
}

</script>

