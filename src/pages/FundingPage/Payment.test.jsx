import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, donorUser } from '../../test/utils';
import Payment from './Payment';
import { createFund } from '../../services/fundService';

vi.mock('../../services/fundService', () => ({
  createFund: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

const fillCard = async (user) => {
  await user.type(screen.getByPlaceholderText('4242 4242 4242 4242'), '4242424242424242');
  await user.type(screen.getByPlaceholderText('MM / YY'), '12/29');
  await user.type(screen.getByPlaceholderText('123'), '123');
};

describe('Payment', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects an invalid amount and does not submit a donation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Payment />, { user: donorUser });

    await user.type(screen.getByPlaceholderText('Donation Amount!'), '0');
    await fillCard(user);
    await user.click(screen.getByRole('button', { name: 'Pay' }));

    expect(screen.getByText('Please enter a valid amount')).toBeInTheDocument();
    expect(createFund).not.toHaveBeenCalled();
  });

  it('records a donation for the logged-in user on a valid amount', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Payment />, { user: donorUser });

    await user.type(screen.getByPlaceholderText('Donation Amount!'), '150');
    await fillCard(user);
    await user.click(screen.getByRole('button', { name: 'Pay' }));

    expect(createFund).toHaveBeenCalledWith({
      user_id: donorUser.uid,
      name: donorUser.displayName,
      email: donorUser.email,
      amount: 150,
    });
  });
});
