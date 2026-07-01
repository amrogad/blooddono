import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, adminUser } from '../../test/utils';
import AllUsersPage from './AllUsersPage';
import { getAllProfiles, setUserRole, setUserStatus } from '../../services/profileService';

vi.mock('../../services/profileService', () => ({
  getAllProfiles: vi.fn(),
  setUserRole: vi.fn().mockResolvedValue({}),
  setUserStatus: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

const sampleUser = {
  id: 'user-1',
  display_name: 'Sara Hassan',
  photo_url: null,
  blood_group: 'A+',
  governorate: 'Cairo',
  city: 'Maadi',
  role: 'donor',
  status: 'active',
};

describe('AllUsersPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists users loaded from the service', async () => {
    getAllProfiles.mockResolvedValue([sampleUser]);
    renderWithProviders(<AllUsersPage />, { user: adminUser });

    expect(await screen.findByText('Sara Hassan')).toBeInTheDocument();
  });

  it('changes a user role', async () => {
    getAllProfiles.mockResolvedValue([sampleUser]);
    const user = userEvent.setup();
    renderWithProviders(<AllUsersPage />, { user: adminUser });

    await screen.findByText('Sara Hassan');
    // comboboxes: [0] is the status filter, [1] is the row's role select
    const roleSelect = screen.getAllByRole('combobox')[1];
    await user.selectOptions(roleSelect, 'admin');

    expect(setUserRole).toHaveBeenCalledWith('user-1', 'admin');
  });

  it('blocks an active user', async () => {
    getAllProfiles.mockResolvedValue([sampleUser]);
    const user = userEvent.setup();
    renderWithProviders(<AllUsersPage />, { user: adminUser });

    await user.click(await screen.findByRole('button', { name: 'Block' }));

    expect(setUserStatus).toHaveBeenCalledWith('user-1', 'blocked');
  });
});
