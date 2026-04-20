import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { DemoPage } from './pages/DemoPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ToastProvider } from './toast';

import './index.css';

const basename = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
const router = createBrowserRouter(
  [
    { path: '/', element: <DemoPage /> },
    { path: '/playground', element: <PlaygroundPage /> },
  ],
  { basename },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>,
);
