import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders
import { popup, options } from './loader';

// View
import './index.scss'
import { OptionsPage } from './OptionsPage';
import { PopupPage } from './PopupPage';

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
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
