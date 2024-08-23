import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { serverpermissions } from './loader';

// View
import './index.scss'
import { ServerPermissonPage } from './ServerPermissionPage';

const router = createHashRouter([
  {
    path: "/options",
    element: <h1>Hello</h1>
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
