import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { LuPlus } from 'react-icons/lu';
import Swal from 'sweetalert2';
import useUserRole from '../../../hooks/useUserRole';
import Loading from '../../../components/Loading';
import { getAllBlogs, updateBlog, deleteBlog } from '../../../services/blogService';

const PER_PAGE = 8;
const actionBtn =
  'h-9 rounded-lg border border-line-strong px-3 text-[13px] font-semibold text-ink transition hover:border-ink/40';

const ContentManagementPage = () => {
  const { role } = useUserRole();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllBlogs()
      .then(setBlogs)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: 'Could not load blogs', text: error.message }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBlog(id, { status: newStatus });
      setBlogs((prev) => prev.map((blog) => (blog.id === id ? { ...blog, status: newStatus } : blog)));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this blog?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });
    if (!confirm.isConfirmed) return;
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Delete failed', text: error.message });
    }
  };

  const filtered = filter === 'all' ? blogs : blogs.filter((blog) => blog.status === filter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">Blogs</h1>
        <Link
          to="/dashboard/content-management-page/add-blogs"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
        >
          <LuPlus className="h-4 w-4" strokeWidth={2.4} />
          Add blog
        </Link>
      </div>

      <select
        aria-label="Filter by status"
        className="mb-5 h-10 rounded-xl border border-line-strong bg-card px-3 text-sm text-ink"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {pageItems.map((blog, index) => (
          <div
            key={blog.id}
            className={`flex flex-wrap items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <img src={blog.thumbnail} alt="" className="h-12 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1 text-[14.5px] font-semibold text-ink">{blog.title}</div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                blog.status === 'published'
                  ? 'bg-success-tint text-success'
                  : 'bg-warning-tint text-warning'
              }`}
            >
              {blog.status}
            </span>
            <Link
              to={`/dashboard/content-management-page/blogs/${blog.id}`}
              className={actionBtn}
            >
              View
            </Link>
            <Link
              to={`/dashboard/content-management-page/edit-blog/${blog.id}`}
              className={actionBtn}
            >
              Edit
            </Link>
            {role === 'admin' && (
              <>
                {blog.status === 'draft' ? (
                  <button className={actionBtn} onClick={() => handleStatusChange(blog.id, 'published')}>
                    Publish
                  </button>
                ) : (
                  <button className={actionBtn} onClick={() => handleStatusChange(blog.id, 'draft')}>
                    Unpublish
                  </button>
                )}
                <button
                  className="h-9 rounded-lg border border-line px-3 text-[13px] font-semibold text-crimson transition hover:bg-crimson-tint"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
        {pageItems.length === 0 && (
          <div className="p-10 text-center text-sm text-muted">No blogs yet.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                page === idx + 1
                  ? 'bg-crimson text-white'
                  : 'border border-line bg-card text-body hover:text-ink'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManagementPage;
