import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { popup, options, dashboard } from './loader';

// View
import './index.scss'
import { OptionsPage } from './OptionsPage';
import { PopupPage } from './PopupPage';
import { DashboardPage } from './Dashboard';

// 使うFontAwesomeのアイコンを読み込む
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock, faCog } from '@fortawesome/free-solid-svg-icons';
library.add(faClock, faCog);

const router = createHashRouter([
  {
    path: "/popup",
    element: <PopupPage />,
    loader: popup,
  },
  {
    path: "/options",
    element: <OptionsPage />,
    loader: options,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    loader: dashboard,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
