import React    from "react";
import {render} from "react-dom";

import MuiThemeProvider     from "material-ui/styles/MuiThemeProvider";
import getMuiTheme          from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import DeckCaptureView from "../../Application/Views/DeckCapture";

import { init } from "../global-pollution";
init(window);

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <DeckCaptureView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
