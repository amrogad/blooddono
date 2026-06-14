import { useState } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import useUserRole from '../../hooks/useUserRole';

const sampleBlogs = [
  {
    _id: '1',
    title: 'Why Donating Blood Saves Lives in Cairo Hospitals',
    thumbnail: '/images/blog-1.jpg',
    content: '<p>Every year, thousands of patients in Cairo hospitals depend on blood donations to survive surgeries, accidents, and chronic illnesses. A single donation can help save up to three lives.</p><p>Local blood banks often run short during the summer months, which makes regular donors extremely valuable to the healthcare system.</p>',
    status: 'published',
    created_at: '2026-05-01T09:00:00',
  },
  {
    _id: '2',
    title: 'Common Myths About Blood Donation',
    thumbnail: '/images/blog-2.jpg',
    content: '<p>Many people avoid donating blood because of myths they have heard from friends or family. For example, donating blood does not make you weak or increase your risk of getting sick.</p><p>In reality, the donation process is quick, safe, and supervised by trained medical staff at every step.</p>',
    status: 'published',
    created_at: '2026-05-08T11:30:00',
  },
  {
    _id: '3',
    title: 'How Often Can You Donate Blood Safely?',
    thumbnail: '/images/blog-3.jpg',
    content: '<p>Most healthy adults can donate whole blood every 56 days, which is roughly eight times a year. Your body needs this time to replace the red blood cells that were removed.</p><p>Doctors recommend keeping a simple log of your donation dates so you do not accidentally donate too soon.</p>',
    status: 'draft',
    created_at: '2026-05-15T14:00:00',
  },
  {
    _id: '4',
    title: 'Preparing for Your First Blood Donation',
    thumbnail: '/images/blog-4.jpg',
    content: '<p>If this is your first time donating, a little preparation goes a long way. Eat a healthy meal, drink plenty of water, and get a good night of sleep before your appointment.</p><p>Bring a valid ID and try to wear a shirt with sleeves that can be rolled up easily.</p>',
    status: 'published',
    created_at: '2026-05-22T08:45:00',
  },
  {
    _id: '5',
    title: "Blood Types Explained: What's Your Type?",
    thumbnail: '/images/blog-5.jpg',
    content: '<p>There are eight main blood types, and knowing yours can be important in an emergency. Type O negative is known as the universal donor because it can be given to almost anyone.</p><p>Ask your local donation center to find out your blood type the next time you donate.</p>',
    status: 'draft',
    created_at: '2026-05-29T16:20:00',
  },
];

const ContentManagementPage = () => {
  const { role } = useUserRole();

  const [blogs, setBlogs] = useState(sampleBlogs);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleStatusChange = (id, newStatus) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog._id === id ? { ...blog, status: newStatus } : blog
      )
    );
    Swal.fire(
      'Success',
      `Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`,
      'success'
    );
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
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
    }
  };

  const filteredBlogs =
    filter === 'all' ? blogs : blogs.filter((blog) => blog.status === filter);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

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
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <img
                    src={blog.thumbnail}
                    alt="thumb"
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td>{blog.title}</td>
                <td className='text-center'>
                  <span
                    className={` w-full capitalize btn btn-small ${blog.status === 'published' ? 'btn-success' : 'btn-warning'
                      }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="flex items-center justify-center flex-wrap gap-2 mt-4">

                    <Link
                      to={`/dashboard/content-management-page/blogs/${blog._id}`}
                      className="btn btn-sm"
                    >
                      View
                    </Link>
                
                  <Link
                    to={`/dashboard/content-management-page/edit-blog/${blog._id}`}
                    className="btn btn-sm"
                  >
                    Edit
                  </Link>

                  {role === 'admin' && (
                    <>
                      {blog.status === 'draft' ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusChange(blog._id, 'published')}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleStatusChange(blog._id, 'draft')}
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(blog._id)}
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
              className={`join-item btn ${currentPage === num + 1 ? 'btn-neutral' : 'btn-outline'
                }`}
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
