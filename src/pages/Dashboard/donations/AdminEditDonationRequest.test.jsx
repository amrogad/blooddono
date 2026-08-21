import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { renderWithProviders, adminUser } from '../../../test/utils';
import AdminEditDonationRequest from './AdminEditDonationRequest';
import { getDonationRequest, updateDonationRequest } from '../../../services/donationService';

vi.mock('../../../services/donationService', () => ({
  getDonationRequest: vi.fn(),
  updateDonationRequest: vi.fn().mockResolvedValue({}),
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
  request_message: 'Urgent, please help',
};

const renderForm = () =>
  renderWithProviders(
    <Routes>
      <Route path="/dashboard/admin-edit-donation/:id" element={<AdminEditDonationRequest />} />
    </Routes>,
    { user: adminUser, route: '/dashboard/admin-edit-donation/req-1' },
  );

describe('AdminEditDonationRequest', () => {
  beforeEach(() => vi.clearAllMocks());

  it('prefills the form with the existing request', async () => {
    getDonationRequest.mockResolvedValue(request);
    renderForm();

    expect(await screen.findByDisplayValue('Mona Khaled')).toBeInTheDocument();
    expect(getDonationRequest).toHaveBeenCalledWith('req-1');
  });

  it('saves the request including its status', async () => {
    getDonationRequest.mockResolvedValue(request);
    const user = userEvent.setup();
    renderForm();

    await screen.findByDisplayValue('Mona Khaled');
    await user.selectOptions(screen.getByDisplayValue('Searching'), 'inprogress');
    await user.click(screen.getByRole('button', { name: 'Update request' }));

    expect(updateDonationRequest).toHaveBeenCalledWith(
      'req-1',
      expect.objectContaining({ recipient_name: 'Mona Khaled', donation_status: 'inprogress' }),
    );
  });
});
