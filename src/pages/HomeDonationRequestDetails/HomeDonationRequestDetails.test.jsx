import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { renderWithProviders, donorUser } from '../../test/utils';
import HomeDonationRequestDetails from './HomeDonationRequestDetails';
import { getRequestDetails, acceptRequest } from '../../services/donationService';

vi.mock('../../services/donationService', () => ({
  getRequestDetails: vi.fn(),
  acceptRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({}) },
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

const renderAt = (id = 'req-1') =>
  renderWithProviders(
    <Routes>
      <Route path="/blood-donation-request/:id" element={<HomeDonationRequestDetails />} />
    </Routes>,
    { user: donorUser, route: `/blood-donation-request/${id}` },
  );

describe('HomeDonationRequestDetails', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads the request details for the route id', async () => {
    getRequestDetails.mockResolvedValue(request);
    renderAt('req-1');

    expect(await screen.findByText('Mona Khaled')).toBeInTheDocument();
    expect(getRequestDetails).toHaveBeenCalledWith('req-1');
  });

  it('accepts the request after confirming in the modal', async () => {
    getRequestDetails.mockResolvedValue(request);
    const user = userEvent.setup();
    renderAt('req-1');

    await user.click(await screen.findByRole('button', { name: 'I can donate' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(acceptRequest).toHaveBeenCalledWith('req-1');
  });
});
