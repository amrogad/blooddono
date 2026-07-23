import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { renderWithProviders, adminUser } from '../../../test/utils';
import DonationRequestDetails from './DonationRequestDetails';
import { getDonationRequest } from '../../../services/donationService';

vi.mock('../../../services/donationService', () => ({
  getDonationRequest: vi.fn(),
}));

const request = {
  id: 'req-1',
  recipient_name: 'Mona Khaled',
  recipient_governorate: 'Cairo',
  recipient_city: 'Nasr City',
  requester_name: 'Ahmed Samir',
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
      <Route path="/dashboard/donation/:id" element={<DonationRequestDetails />} />
    </Routes>,
    { user: adminUser, route: `/dashboard/donation/${id}` },
  );

describe('DonationRequestDetails', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads and shows the request from the route id', async () => {
    getDonationRequest.mockResolvedValue(request);
    renderAt('req-1');

    expect(await screen.findByText('Mona Khaled')).toBeInTheDocument();
    expect(screen.getByText('Nasr City Hospital')).toBeInTheDocument();
    expect(getDonationRequest).toHaveBeenCalledWith('req-1');
  });

  it('shows a not-found message when the request is missing', async () => {
    getDonationRequest.mockRejectedValue(new Error('not found'));
    renderAt('missing');

    expect(await screen.findByText('Request not found')).toBeInTheDocument();
  });
});
