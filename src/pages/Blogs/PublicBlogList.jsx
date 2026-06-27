import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Loading from '../shared/Loading';
import { getPublishedBlogs } from '../../services/blogService';

const PublicBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Latest Blogs</h2>

      {loading ? (
        <Loading />
      ) : blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="card bg-base-100 shadow p-4">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="rounded mb-3 h-48 w-full object-cover"
              />
              <h3 className="text-xl font-semibold my-4">{blog.title}</h3>

              <div
                className="prose max-w-full mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <Link to={`/blogs/${blog.id}`} className="btn btn-neutral mt-2">
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicBlogList;
