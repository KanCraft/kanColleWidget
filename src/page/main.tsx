import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { popup, options, dashboard, damagesnapshot, logbook } from './loader';

// View
import './index.scss'
import { OptionsPage } from './options/OptionsPage';
import { PopupPage } from './PopupPage';
import { DashboardPage } from './Dashboard';
import { FleetCapturePage } from './fleet-capture/FleetCapturePage';
import { DamageSnapshotPage } from './snapshot/DamageSnapshotPage';
import { LogbookPage } from './logbook/LogbookPage';

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
  {
    path: "/logbook",
    element: <LogbookPage />,
    loader: logbook,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
