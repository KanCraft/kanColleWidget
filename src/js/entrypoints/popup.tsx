import React from "react";
import {render} from "react-dom";
import "./global-pollution";
import App from "../Applications/Components/Popup";

// 使用するすべてのアイコンをここでlibraryに登録する必要がある
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faClock,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faCog,
  faClock,
  faGripVertical,
);

render(<App />, document.querySelector("main#app"));
