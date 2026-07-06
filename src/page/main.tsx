import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { popup, options, dashboard, damagesnapshot, logbook, fleetcapture, questTracker } from './loader';

// View
import './index.scss'
import { OptionsPage } from './options/OptionsPage';
import { PopupPage } from './PopupPage';
import { DashboardPage } from './Dashboard';
import { FleetCapturePage } from './fleet-capture/FleetCapturePage';
import { ScreenshotEditPage } from './screenshot-edit/ScreenshotEditPage';
import { DamageSnapshotPage } from './snapshot/DamageSnapshotPage';
import { LogbookPage } from './logbook/LogbookPage';
import { QuestTrackerPage } from './quest-tracker/QuestTrackerPage';

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
    loader: fleetcapture,
  },
  {
    path: "/screenshot-edit",
    element: <ScreenshotEditPage />,
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
  },
  {
    path: "/quest-tracker",
    element: <QuestTrackerPage />,
    loader: questTracker,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
