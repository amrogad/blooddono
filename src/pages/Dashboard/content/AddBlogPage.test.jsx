import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, adminUser } from '../../../test/utils';
import AddBlogPage from './AddBlogPage';
import { createBlog } from '../../../services/blogService';

vi.mock('../../../services/blogService', () => ({
  createBlog: vi.fn().mockResolvedValue({}),
  uploadBlogImage: vi.fn(),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

describe('AddBlogPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a draft blog from the title and content', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddBlogPage />, { user: adminUser });

    await user.type(screen.getByPlaceholderText('Blog Title'), 'Why donate blood');
    await user.type(
      screen.getByPlaceholderText('Write your blog content here...'),
      'It saves lives.',
    );
    await user.click(screen.getByRole('button', { name: 'Create Blog' }));

    expect(createBlog).toHaveBeenCalledWith({
      title: 'Why donate blood',
      thumbnail: null,
      content: 'It saves lives.',
      status: 'draft',
    });
  });
});
