import React from 'react';
import {render} from 'react-dom';

import {init} from '../global-pollution';
init(window);

let url = new URL(location.href);
render(
  <img src={url.searchParams.get('img')} />,
  document.querySelector('#main')
);
