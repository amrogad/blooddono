import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import FundingPage from './FundingPage';
import { getFunds } from '../../services/fundService';

vi.mock('../../services/fundService', () => ({
  getFunds: vi.fn(),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({}) },
}));

const funds = [
  { id: 'f-1', name: 'Sara Nabil', amount: 250, paid_at: '2026-07-10T09:00:00Z' },
  { id: 'f-2', name: 'Omar Fathy', amount: 100, paid_at: '2026-07-11T09:00:00Z' },
];

describe('FundingPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists the recorded donations', async () => {
    getFunds.mockResolvedValue(funds);
    renderWithProviders(<FundingPage />);

    expect(await screen.findByText('Sara Nabil')).toBeInTheDocument();
    expect(screen.getByText('Omar Fathy')).toBeInTheDocument();
    expect(getFunds).toHaveBeenCalled();
  });

  it('shows an empty state when there are no donations', async () => {
    getFunds.mockResolvedValue([]);
    renderWithProviders(<FundingPage />);

    expect(await screen.findByText('No donations yet.')).toBeInTheDocument();
  });
});
