import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, donorUser } from '../../test/utils';
import Profile from './Profile';
import { updateProfile } from '../../services/profileService';

vi.mock('../../services/profileService', () => ({
  updateProfile: vi.fn().mockResolvedValue({}),
  uploadAvatar: vi.fn(),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

describe('Profile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows the logged-in user data', () => {
    renderWithProviders(<Profile />, { user: donorUser });
    expect(screen.getByDisplayValue('Demo Donor')).toBeInTheDocument();
  });

  it('saves edited profile fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Profile />, { user: donorUser });

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const name = screen.getByDisplayValue('Demo Donor');
    await user.clear(name);
    await user.type(name, 'Amro Gad');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() =>
      expect(updateProfile).toHaveBeenCalledWith(
        donorUser.uid,
        expect.objectContaining({ display_name: 'Amro Gad' }),
      ),
    );
  });
});
