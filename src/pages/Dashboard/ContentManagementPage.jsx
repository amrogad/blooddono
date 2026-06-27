import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../shared/Loading';
import { getAllBlogs, updateBlog, deleteBlog } from '../../services/blogService';

const ContentManagementPage = () => {
  const { role } = useUserRole();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      setBlogs((prev) =>
        prev.map((blog) => (blog.id === id ? { ...blog, status: newStatus } : blog)),
      );
      Swal.fire(
        'Success',
        `Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`,
        'success',
      );
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this blog?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBlog(id);
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
        Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Delete failed', text: error.message });
      }
    }
  };

  const filteredBlogs = filter === 'all' ? blogs : blogs.filter((blog) => blog.status === filter);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Content Management 📝</h2>
        <Link to="/dashboard/content-management-page/add-blogs" className="btn bg-[#ff4136]">
          Add Blog
        </Link>
      </div>

      <div className="mb-4">
        <select
          className="select select-bordered"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <img
                    src={blog.thumbnail}
                    alt="thumb"
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td>{blog.title}</td>
                <td className="text-center">
                  <span
                    className={` w-full capitalize btn btn-small ${blog.status === 'published' ? 'btn-success' : 'btn-warning'}`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="flex items-center justify-center flex-wrap gap-2 mt-4">
                  <Link
                    to={`/dashboard/content-management-page/blogs/${blog.id}`}
                    className="btn btn-sm"
                  >
                    View
                  </Link>
                  <Link
                    to={`/dashboard/content-management-page/edit-blog/${blog.id}`}
                    className="btn btn-sm"
                  >
                    Edit
                  </Link>

                  {role === 'admin' && (
                    <>
                      {blog.status === 'draft' ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusChange(blog.id, 'published')}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleStatusChange(blog.id, 'draft')}
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(blog.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="join">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              className={`join-item btn ${currentPage === num + 1 ? 'btn-neutral' : 'btn-outline'}`}
              onClick={() => setCurrentPage(num + 1)}
            >
              {num + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage;
