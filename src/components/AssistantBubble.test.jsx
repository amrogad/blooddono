import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, donorUser } from '../test/utils';
import AssistantBubble from './AssistantBubble';
import { askAssistant } from '../services/assistantService';

vi.mock('../services/assistantService', () => ({
  askAssistant: vi.fn(),
}));

vi.mock('../services/donationService', () => ({
  createDonationRequest: vi.fn(),
}));

const openPanel = async (user) => {
  await user.click(screen.getByRole('button', { name: 'Ask the assistant' }));
};

describe('AssistantBubble', () => {
  beforeEach(() => vi.clearAllMocks());

  it('starts collapsed so it never covers the page on load', () => {
    renderWithProviders(<AssistantBubble />);
    expect(screen.getByRole('button', { name: 'Ask the assistant' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows suggestion chips before any conversation starts', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    expect(screen.getByText('What should I eat before donating?')).toBeInTheDocument();
  });

  it('sends a typed question and renders the reply', async () => {
    askAssistant.mockResolvedValue({ reply: 'Yes, you can donate.', toolsUsed: [] });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    await user.type(screen.getByPlaceholderText('Ask a question...'), 'Can I donate?');
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText('Yes, you can donate.')).toBeInTheDocument();
    expect(screen.getByText('Can I donate?')).toBeInTheDocument();
  });

  it('sends only role and text to the service, never display-only state', async () => {
    askAssistant.mockResolvedValue({ reply: 'ok', toolsUsed: [] });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    await user.type(screen.getByPlaceholderText('Ask a question...'), 'Hi');
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => expect(askAssistant).toHaveBeenCalled());
    expect(askAssistant).toHaveBeenCalledWith([{ role: 'user', text: 'Hi' }], 'en');
  });

  it('flags when the answer came from a real donor lookup', async () => {
    askAssistant.mockResolvedValue({
      reply: 'There is 1 donor nearby.',
      toolsUsed: ['find_compatible_donors'],
    });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    await user.click(screen.getByText('How many donors near me could give me blood?'));

    expect(await screen.findByText('Checked the donor database')).toBeInTheDocument();
  });

  it('does not flag a lookup when the model answered on its own', async () => {
    askAssistant.mockResolvedValue({ reply: 'Eat a full meal.', toolsUsed: [] });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    await user.click(screen.getByText('What should I eat before donating?'));

    expect(await screen.findByText('Eat a full meal.')).toBeInTheDocument();
    expect(screen.queryByText('Checked the donor database')).not.toBeInTheDocument();
  });

  it('shows an error bubble when the request fails', async () => {
    askAssistant.mockRejectedValue(new Error('502'));
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    await user.click(screen.getByText('What should I eat before donating?'));

    expect(await screen.findByText('Something went wrong. Try again.')).toBeInTheDocument();
  });

  it('renders markdown emphasis instead of printing the asterisks', async () => {
    askAssistant.mockResolvedValue({
      reply: 'There are **3 donors** in Nasr City. *Not medical advice.*',
      toolsUsed: [],
    });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    await user.click(screen.getByText('What should I eat before donating?'));

    expect(await screen.findByText('3 donors')).toBeInTheDocument();
    expect(screen.getByText('3 donors').tagName).toBe('STRONG');
    expect(screen.getByText('Not medical advice.').tagName).toBe('EM');
    expect(screen.queryByText(/\*\*/)).not.toBeInTheDocument();
  });

  it('renders a draft as a card to confirm, not as text in the bubble', async () => {
    askAssistant.mockResolvedValue({
      reply: 'Have a look and press Confirm.',
      toolsUsed: ['draft_donation_request'],
      draft: {
        recipient_name: 'Mona Fahmy',
        blood_group: 'O-',
        hospital_name: 'Wadi El Nil Hospital',
        recipient_governorate: 'Cairo',
        recipient_city: 'Nasr City',
        full_address: '12 Abbas El Akkad St',
        donation_date: '2027-08-24',
        donation_time: '14:30',
        request_message: 'Two units needed before surgery.',
      },
    });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />, { user: donorUser });
    await openPanel(user);

    await user.type(screen.getByPlaceholderText('Ask a question...'), 'Post a request');
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText('Mona Fahmy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm and post' })).toBeInTheDocument();
  });

  it('leaves the reply alone when the model drafted nothing', async () => {
    askAssistant.mockResolvedValue({ reply: 'Eat a full meal.', toolsUsed: [], draft: null });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />, { user: donorUser });
    await openPanel(user);

    await user.click(screen.getByText('What should I eat before donating?'));

    expect(await screen.findByText('Eat a full meal.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm and post' })).not.toBeInTheDocument();
  });

  it('closes on the close button and keeps the conversation for next time', async () => {
    askAssistant.mockResolvedValue({ reply: 'Eat a full meal.', toolsUsed: [] });
    const user = userEvent.setup();
    renderWithProviders(<AssistantBubble />);
    await openPanel(user);

    await user.click(screen.getByText('What should I eat before donating?'));
    expect(await screen.findByText('Eat a full meal.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close assistant' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await openPanel(user);
    expect(screen.getByText('Eat a full meal.')).toBeInTheDocument();
  });
});
