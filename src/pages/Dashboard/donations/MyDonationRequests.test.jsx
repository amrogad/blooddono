import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, donorUser } from '../../../test/utils';
import MyDonationRequests from './MyDonationRequests';
import { getMyDonationRequests, deleteDonationRequest } from '../../../services/donationService';

vi.mock('../../../services/donationService', () => ({
  getMyDonationRequests: vi.fn(),
  updateDonationRequest: vi.fn().mockResolvedValue({}),
  deleteDonationRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

const ownRequest = {
  id: 'req-1',
  recipient_name: 'Mona Khaled',
  recipient_governorate: 'Cairo',
  recipient_city: 'Nasr City',
  donation_date: '2026-07-10',
  donation_time: '10:00',
  blood_group: 'A+',
  donation_status: 'pending',
};

describe('MyDonationRequests', () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists the logged-in user's requests", async () => {
    getMyDonationRequests.mockResolvedValue([ownRequest]);
    renderWithProviders(<MyDonationRequests />, { user: donorUser });

    expect(await screen.findByText('Mona Khaled')).toBeInTheDocument();
    expect(getMyDonationRequests).toHaveBeenCalledWith(donorUser.uid);
  });

  it('deletes a request after confirmation', async () => {
    getMyDonationRequests.mockResolvedValue([ownRequest]);
    const user = userEvent.setup();
    renderWithProviders(<MyDonationRequests />, { user: donorUser });

    await user.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(deleteDonationRequest).toHaveBeenCalledWith('req-1');
  });
});
