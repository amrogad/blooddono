import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, donorUser } from '../../../test/utils';
import CreateDonationRequest from './CreateDonationRequest';
import { createDonationRequest } from '../../../services/donationService';

vi.mock('../../../services/donationService', () => ({
  createDonationRequest: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

describe('CreateDonationRequest', () => {
  beforeEach(() => vi.clearAllMocks());

  it('blocks advancing and shows validation errors when step-one fields are empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateDonationRequest />, { user: donorUser });

    await user.click(screen.getByRole('button', { name: /Continue/ }));

    expect(await screen.findByText('Recipient name is required')).toBeInTheDocument();
    expect(createDonationRequest).not.toHaveBeenCalled();
  });

  it('shows the logged-in user as the requester', () => {
    renderWithProviders(<CreateDonationRequest />, { user: donorUser });
    expect(screen.getByText(/Posting as Demo Donor/)).toBeInTheDocument();
  });
});
