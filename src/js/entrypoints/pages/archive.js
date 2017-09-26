import React    from "react";
import {render} from "react-dom";
import MuiThemeProvider     from "material-ui/styles/MuiThemeProvider";
import getMuiTheme          from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import  ArchiveView from "../../Application/Views/Archive";

import { init } from "../global-pollution";
init(window);

render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <ArchiveView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
