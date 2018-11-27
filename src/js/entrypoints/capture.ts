import Vue from "vue";
import Capture from "../Applications/Components/Capture/index.vue";

new Vue({
  render: (h) => {
    return h(Capture);
  },
}).$mount("main#app");
