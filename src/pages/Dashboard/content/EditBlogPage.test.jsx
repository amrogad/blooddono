import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { renderWithProviders, adminUser } from '../../../test/utils';
import EditBlogPage from './EditBlogPage';
import { getBlog, updateBlog } from '../../../services/blogService';

vi.mock('../../../services/blogService', () => ({
  getBlog: vi.fn(),
  updateBlog: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({}) },
}));

const blog = {
  id: 'blog-1',
  title: 'Who can give blood',
  thumbnail: '/images/blog-1.png',
  content: '<p>Anyone healthy and eligible.</p>',
};

const renderForm = () =>
  renderWithProviders(
    <Routes>
      <Route path="/dashboard/edit-blog/:id" element={<EditBlogPage />} />
    </Routes>,
    { user: adminUser, route: '/dashboard/edit-blog/blog-1' },
  );

describe('EditBlogPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('prefills the form with the existing blog', async () => {
    getBlog.mockResolvedValue(blog);
    renderForm();

    expect(await screen.findByDisplayValue('Who can give blood')).toBeInTheDocument();
    expect(getBlog).toHaveBeenCalledWith('blog-1');
  });

  it('saves the edited blog', async () => {
    getBlog.mockResolvedValue(blog);
    const user = userEvent.setup();
    renderForm();

    const title = await screen.findByDisplayValue('Who can give blood');
    await user.clear(title);
    await user.type(title, 'Who can donate blood');
    await user.click(screen.getByRole('button', { name: 'Update blog' }));

    expect(updateBlog).toHaveBeenCalledWith(
      'blog-1',
      expect.objectContaining({ title: 'Who can donate blood' }),
    );
  });
});
