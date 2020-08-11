import * as React from "react";
import {render} from "react-dom";
import "./global-pollution";

import App from "../Applications/Components/Archive";

render(<App />, document.querySelector("main#app"));
