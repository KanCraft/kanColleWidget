import React from "react";
import {render} from "react-dom";

import App from "../Applications/Components/Popup";

// import { library } from "@fortawesome/fontawesome-svg-core";
// import {
//   faCog,
//   faGripVertical,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// library.add(
//   faCog,
//   faGripVertical,
// );
// Vue.component("font-awesome-icon", FontAwesomeIcon);
// Vue.config.productionTip = false;

render(<App />, document.querySelector("main#app"));
