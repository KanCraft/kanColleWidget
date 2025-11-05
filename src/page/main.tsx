import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { popup, options, dashboard, damagesnapshot } from './loader';

// View
import './index.scss'
import { OptionsPage } from './options/OptionsPage';
import { PopupPage } from './PopupPage';
import { DashboardPage } from './Dashboard';
import { FleetCapturePage } from './fleet-capture/FleetCapturePage';
import { DamageSnapshotPage } from './snapshot/DamageSnapshotPage';

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
    path: "/fleet-capture",
    element: <FleetCapturePage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    loader: dashboard,
  },
  {
    path: "/damage-snapshot",
    element: <DamageSnapshotPage />,
    loader: damagesnapshot,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
