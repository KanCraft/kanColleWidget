/**
 * 動画キャプチャをやるところ
 */
import React from "react";
import { render } from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import { init } from "../global-pollution";
init(window);

import StreamView from "../../Components/Views/Stream";
import theme from "../../Components/Views/Stream/theme";

render(
  <MuiThemeProvider muiTheme={theme}>
    <StreamView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
