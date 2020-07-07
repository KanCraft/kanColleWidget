import * as React from "react";
import {render} from "react-dom";
import "./global-pollution";

import Capture from "../Applications/Components/Capture";

render(<Capture />, document.querySelector("main#app"));
