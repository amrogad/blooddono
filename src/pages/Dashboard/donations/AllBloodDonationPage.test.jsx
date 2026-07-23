import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, adminUser, donorUser } from '../../../test/utils';
import AllBloodDonationPage from './AllBloodDonationPage';
import {
  getDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
} from '../../../services/donationService';

vi.mock('../../../services/donationService', () => ({
  getDonationRequests: vi.fn(),
  updateDonationRequest: vi.fn().mockResolvedValue({}),
  deleteDonationRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

const request = {
  id: 'req-1',
  recipient_name: 'Mona Khaled',
  recipient_governorate: 'Cairo',
  recipient_city: 'Nasr City',
  hospital_name: 'Nasr City Hospital',
  full_address: '12 Makram Ebeid',
  blood_group: 'A+',
  donation_date: '2026-08-01',
  donation_time: '10:00',
  donation_status: 'pending',
};

describe('AllBloodDonationPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists every donation request', async () => {
    getDonationRequests.mockResolvedValue([request]);
    renderWithProviders(<AllBloodDonationPage />, { user: adminUser });

    expect(await screen.findByText('Mona Khaled')).toBeInTheDocument();
    expect(getDonationRequests).toHaveBeenCalled();
  });

  it('lets an admin change a request status', async () => {
    getDonationRequests.mockResolvedValue([request]);
    const user = userEvent.setup();
    renderWithProviders(<AllBloodDonationPage />, { user: adminUser });

    await user.selectOptions(
      await screen.findByRole('combobox', { name: 'Status for Mona Khaled' }),
      'done',
    );

    expect(updateDonationRequest).toHaveBeenCalledWith('req-1', { donation_status: 'done' });
  });

  it('deletes a request after admin confirmation', async () => {
    getDonationRequests.mockResolvedValue([request]);
    const user = userEvent.setup();
    renderWithProviders(<AllBloodDonationPage />, { user: adminUser });

    await user.click(await screen.findByRole('button', { name: 'Delete Mona Khaled' }));

    expect(deleteDonationRequest).toHaveBeenCalledWith('req-1');
  });

  it('hides admin controls from non-admin roles', async () => {
    getDonationRequests.mockResolvedValue([request]);
    renderWithProviders(<AllBloodDonationPage />, { user: donorUser });

    await screen.findByText('Mona Khaled');
    expect(screen.queryByRole('button', { name: 'Delete Mona Khaled' })).not.toBeInTheDocument();
  });
});
