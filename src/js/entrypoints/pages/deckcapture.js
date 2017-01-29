import React from "react";
import { render } from "react-dom";
// import { Provider } from "react-redux"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import { createStore } from "redux";

import DeckCaptureView from "../../Components/Views/DeckCapture";

import { init } from "../global-pollution";
init(window);

import "font-awesome-webpack";

// Redux使ってねえんだよなあ...
let store = createStore((state = {} /*, action */) => {
    return state;
});

render(
  <MuiThemeProvider store={store} muiTheme={getMuiTheme()}>
    <DeckCaptureView />
  </MuiThemeProvider>,
  document.getElementById("main")
);
