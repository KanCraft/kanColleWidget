import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { popup, serverpermissions } from './loader';

// View
import './index.scss'
import { ServerPermissonPage } from './ServerPermissionPage';
import { PopupPage } from './PopupPage';

const router = createHashRouter([
  {
    path: "/options",
    element: <h1>Hello</h1>
  },
  {
    path: "/popup",
    element: <PopupPage />,
    loader: popup,
  },
  {
    path: "/permissions",
    element: <ServerPermissonPage />,
    loader: serverpermissions,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
