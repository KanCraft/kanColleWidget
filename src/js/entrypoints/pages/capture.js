import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { createStore } from 'redux'

import CaptureView from '../../Components/Views/Capture';

import { init } from '../global-pollution';
init(window);

import 'font-awesome-webpack';

let store = createStore((state = {}, action) => {
  return state;
})

render(
  <MuiThemeProvider store={store} muiTheme={getMuiTheme()}>
    <CaptureView />
  </MuiThemeProvider>,
  document.getElementById('main')
);
