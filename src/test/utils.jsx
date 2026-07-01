import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import authReducer from '../redux/authSlice';

// Render a component wrapped in the providers it needs (Redux + Router),
// with an optional logged-in user preloaded into auth state.
export function renderWithProviders(ui, { user = null, route = '/' } = {}) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user, loading: false } },
  });
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );
  return { store, ...result };
}

export const donorUser = {
  uid: 'donor-1',
  email: 'donor@blooddono.demo',
  displayName: 'Demo Donor',
  photoURL: null,
  role: 'donor',
  status: 'active',
  bloodGroup: 'O+',
  governorate: 'Cairo',
  city: 'Nasr City',
  isSearchable: true,
};

export const adminUser = {
  uid: 'admin-1',
  email: 'admin@blooddono.demo',
  displayName: 'Demo Admin',
  photoURL: null,
  role: 'admin',
  status: 'active',
};
