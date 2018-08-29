<template>
  <div>
    <h1 @click="foobar">ふえええ</h1>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

// FIXME: Unexpected character '@'
// @Component
export default class Popup extends Vue {
  foobar() {
    alert("hogeeeee");
  }
}

</script>