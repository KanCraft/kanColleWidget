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
