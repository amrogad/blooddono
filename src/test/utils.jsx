import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { LocaleProvider } from '../providers/LocaleProvider';
import authReducer from '../redux/authSlice';

// Render a component wrapped in the providers it needs (Redux + Router + i18n),
// with an optional logged-in user preloaded into auth state.
export function renderWithProviders(ui, { user = null, route = '/' } = {}) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user, loading: false } },
  });
  const result = render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <LocaleProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </LocaleProvider>
      </Provider>
    </I18nextProvider>,
  );
  return { store, ...result };
}

export const donorUser = {
  uid: 'donor-1',
  email: 'donor@blooddono.demo',
  displayName: 'Demo Donor',
  photoURL: null,
  role: 'user',
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
