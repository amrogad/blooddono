import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Login from './Login';
import Swal from 'sweetalert2';
import { signIn } from '../../services/authService';

vi.mock('../../services/authService', () => ({
  signIn: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

describe('Login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not attempt sign-in with an invalid email', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText('Email'), 'not-an-email');
    await user.type(container.querySelector('input[type="password"]'), 'Demo123!');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    // invalid input must never reach the auth service
    expect(signIn).not.toHaveBeenCalled();
  });

  it('signs in with valid credentials', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText('Email'), 'donor@blooddono.demo');
    await user.type(container.querySelector('input[type="password"]'), 'Demo123!');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(signIn).toHaveBeenCalledWith('donor@blooddono.demo', 'Demo123!'));
  });

  it('shows an error when sign-in fails', async () => {
    signIn.mockRejectedValueOnce(new Error('Invalid login credentials'));
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText('Email'), 'donor@blooddono.demo');
    await user.type(container.querySelector('input[type="password"]'), 'Demo123!');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error' })),
    );
  });
});
