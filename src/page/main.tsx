import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createHashRouter } from "react-router-dom";

// Loaders

// View
import './index.scss'

const router = createHashRouter([
  {
    path: "/options",
    element: <h1>Hello</h1>
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
