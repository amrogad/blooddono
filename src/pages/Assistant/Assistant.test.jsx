import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Assistant from './Assistant';
import { askAssistant } from '../../services/assistantService';

vi.mock('../../services/assistantService', () => ({
  askAssistant: vi.fn(),
}));

describe('Assistant', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows suggestion chips before any conversation starts', () => {
    renderWithProviders(<Assistant />);
    expect(screen.getByText('What should I eat before donating?')).toBeInTheDocument();
  });

  it('sends a typed question and renders the reply', async () => {
    askAssistant.mockResolvedValue({ reply: 'Yes, you can donate.', toolsUsed: [] });
    const user = userEvent.setup();
    renderWithProviders(<Assistant />);

    await user.type(screen.getByPlaceholderText('Ask a question...'), 'Can I donate?');
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText('Yes, you can donate.')).toBeInTheDocument();
    expect(screen.getByText('Can I donate?')).toBeInTheDocument();
  });

  it('sends only role and text to the service, never display-only state', async () => {
    askAssistant.mockResolvedValue({ reply: 'ok', toolsUsed: [] });
    const user = userEvent.setup();
    renderWithProviders(<Assistant />);

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
    renderWithProviders(<Assistant />);

    await user.click(screen.getByText('How many donors near me could give me blood?'));

    expect(await screen.findByText('Checked the donor database')).toBeInTheDocument();
  });

  it('does not flag a lookup when the model answered on its own', async () => {
    askAssistant.mockResolvedValue({ reply: 'Eat a full meal.', toolsUsed: [] });
    const user = userEvent.setup();
    renderWithProviders(<Assistant />);

    await user.click(screen.getByText('What should I eat before donating?'));

    expect(await screen.findByText('Eat a full meal.')).toBeInTheDocument();
    expect(screen.queryByText('Checked the donor database')).not.toBeInTheDocument();
  });

  it('shows an error bubble when the request fails', async () => {
    askAssistant.mockRejectedValue(new Error('502'));
    const user = userEvent.setup();
    renderWithProviders(<Assistant />);

    await user.click(screen.getByText('What should I eat before donating?'));

    expect(await screen.findByText('Something went wrong. Try again.')).toBeInTheDocument();
  });
});
