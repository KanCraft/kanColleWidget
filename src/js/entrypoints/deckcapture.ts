import Vue from "vue";
import DeckCapture from "../Applications/Components/DeckCapture/index.vue";

new Vue({
  render: (h) => {
    return h(DeckCapture);
  },
}).$mount("main#app");
