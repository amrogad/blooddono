import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import router from './routes.jsx';
import { store } from './redux/store.js';
import AuthProvider from './auth/AuthProvider.jsx';
import { ThemeProvider } from './providers/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
