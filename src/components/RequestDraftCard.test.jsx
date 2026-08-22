import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, donorUser } from '../test/utils';
import RequestDraftCard from './RequestDraftCard';
import { createDonationRequest } from '../services/donationService';

vi.mock('../services/donationService', () => ({
  createDonationRequest: vi.fn(),
}));

const navigate = vi.fn();
vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

// A draft as the edge function hands it over: already validated, already shaped
// like the request columns.
const draft = {
  recipient_name: 'Mona Fahmy',
  blood_group: 'O-',
  hospital_name: 'Wadi El Nil Hospital',
  recipient_governorate: 'Cairo',
  recipient_city: 'Nasr City',
  full_address: '12 Abbas El Akkad St',
  donation_date: '2027-08-24',
  donation_time: '14:30',
  request_message: 'Two units needed before surgery.',
};

const renderCard = () => renderWithProviders(<RequestDraftCard draft={draft} />, { user: donorUser });

describe('RequestDraftCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows the drafted request so it can be checked before posting', () => {
    renderCard();

    expect(screen.getByText('Mona Fahmy')).toBeInTheDocument();
    expect(screen.getByText('O-')).toBeInTheDocument();
    expect(screen.getByText(/Wadi El Nil Hospital/)).toBeInTheDocument();
    expect(screen.getByText('12 Abbas El Akkad St')).toBeInTheDocument();
    expect(screen.getByText('Two units needed before surgery.')).toBeInTheDocument();
    expect(screen.getByText('Check before posting')).toBeInTheDocument();
  });

  it('posts nothing until the user confirms', () => {
    renderCard();
    expect(createDonationRequest).not.toHaveBeenCalled();
  });

  // The model proposes the row; the requester is taken from the session, so the
  // insert lands under the same policy as the form.
  it('stamps the signed-in user onto the row rather than trusting the draft', async () => {
    createDonationRequest.mockResolvedValue({ id: 'req-1' });
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: 'Confirm and post' }));

    await waitFor(() => expect(createDonationRequest).toHaveBeenCalled());
    expect(createDonationRequest).toHaveBeenCalledWith({
      ...draft,
      requester_id: 'donor-1',
      requester_name: 'Demo Donor',
      requester_email: 'donor@blooddono.demo',
    });
  });

  it('confirms once even when the button is clicked twice', async () => {
    let resolvePost;
    createDonationRequest.mockReturnValue(new Promise((r) => { resolvePost = r; }));
    const user = userEvent.setup();
    renderCard();

    const confirm = screen.getByRole('button', { name: 'Confirm and post' });
    await user.click(confirm);
    await user.click(confirm);
    resolvePost({ id: 'req-1' });

    await waitFor(() => expect(screen.getByText('Your request is live.')).toBeInTheDocument());
    expect(createDonationRequest).toHaveBeenCalledTimes(1);
  });

  it('replaces the buttons with a link to the request once it is posted', async () => {
    createDonationRequest.mockResolvedValue({ id: 'req-1' });
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: 'Confirm and post' }));

    expect(await screen.findByText('Your request is live.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm and post' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'View' }));
    expect(navigate).toHaveBeenCalledWith('/home-donation-request-details/req-1');
  });

  it('keeps the draft on screen to retry when the insert fails', async () => {
    createDonationRequest.mockRejectedValue(new Error('RLS'));
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: 'Confirm and post' }));

    expect(
      await screen.findByText('Could not post that. Try again, or open it in the full form.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm and post' })).toBeEnabled();
  });

  it('discards the draft without posting it', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: 'Discard this draft' }));

    expect(screen.getByText('Draft discarded.')).toBeInTheDocument();
    expect(screen.queryByText('Mona Fahmy')).not.toBeInTheDocument();
    expect(createDonationRequest).not.toHaveBeenCalled();
  });

  // The card is deliberately read-only, so the way out of a typo is the form the
  // draft columns already match.
  it('hands the draft to the full form when a field needs editing', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('button', { name: 'Open in the full form' }));

    expect(navigate).toHaveBeenCalledWith('/dashboard/create-donation-request', {
      state: { draft },
    });
    expect(createDonationRequest).not.toHaveBeenCalled();
  });
});
