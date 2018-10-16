import Vue from "vue";
import App from "../Applications/Components/Popup/index.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faCog,
  faGripVertical,
);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
  render: (h) => {
    return h(App);
  },
}).$mount("main#app");
