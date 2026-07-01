import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, adminUser } from '../../../test/utils';
import ContentManagementPage from './ContentManagementPage';
import { getAllBlogs, updateBlog, deleteBlog } from '../../../services/blogService';

vi.mock('../../../services/blogService', () => ({
  getAllBlogs: vi.fn(),
  updateBlog: vi.fn().mockResolvedValue({}),
  deleteBlog: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

const draftBlog = {
  id: 'blog-1',
  title: 'Common myths about donating',
  thumbnail: '/images/blog-2.jpg',
  content: '<p>x</p>',
  status: 'draft',
};

describe('ContentManagementPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists blogs loaded from the service', async () => {
    getAllBlogs.mockResolvedValue([draftBlog]);
    renderWithProviders(<ContentManagementPage />, { user: adminUser });

    expect(await screen.findByText('Common myths about donating')).toBeInTheDocument();
  });

  it('publishes a draft blog', async () => {
    getAllBlogs.mockResolvedValue([draftBlog]);
    const user = userEvent.setup();
    renderWithProviders(<ContentManagementPage />, { user: adminUser });

    await user.click(await screen.findByRole('button', { name: 'Publish' }));

    expect(updateBlog).toHaveBeenCalledWith('blog-1', { status: 'published' });
  });

  it('deletes a blog after confirmation', async () => {
    getAllBlogs.mockResolvedValue([draftBlog]);
    const user = userEvent.setup();
    renderWithProviders(<ContentManagementPage />, { user: adminUser });

    await user.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(deleteBlog).toHaveBeenCalledWith('blog-1');
  });
});
