import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { renderWithProviders, adminUser } from '../../../test/utils';
import BlogDetails from './BlogDetails';
import { getBlog } from '../../../services/blogService';

vi.mock('../../../services/blogService', () => ({
  getBlog: vi.fn(),
}));

const blog = {
  id: 'blog-1',
  title: 'Who can give blood',
  thumbnail: '/images/blog-1.png',
  content: '<p>Anyone healthy and eligible.</p>',
};

const renderAt = (id = 'blog-1') =>
  renderWithProviders(
    <Routes>
      <Route path="/dashboard/blog/:id" element={<BlogDetails />} />
    </Routes>,
    { user: adminUser, route: `/dashboard/blog/${id}` },
  );

describe('BlogDetails (dashboard)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the blog for the route id', async () => {
    getBlog.mockResolvedValue(blog);
    renderAt('blog-1');

    expect(await screen.findByText('Who can give blood')).toBeInTheDocument();
    expect(screen.getByText('Anyone healthy and eligible.')).toBeInTheDocument();
    expect(getBlog).toHaveBeenCalledWith('blog-1');
  });

  it('shows a not-found message when the blog is missing', async () => {
    getBlog.mockRejectedValue(new Error('not found'));
    renderAt('missing');

    expect(await screen.findByText('Blog not found')).toBeInTheDocument();
  });
});
