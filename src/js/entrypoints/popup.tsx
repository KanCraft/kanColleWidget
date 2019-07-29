import React from "react";
import {render} from "react-dom";

import App from "../Applications/Components/Popup";

// 使用するすべてのアイコンをここでlibraryに登録する必要がある
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faCog,
    faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
library.add(
    faCog,
    faGripVertical,
);

render(<App />, document.querySelector("main#app"));
