import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Loading from '../shared/Loading';
import { getBlog } from '../../services/blogService';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlog(id)
      .then(setBlog)
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
        <button
          className="btn btn-neutral"
          onClick={() => navigate('/dashboard/content-management-page')}
        >
          Back to Content Management
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <img src={blog.thumbnail} alt="blog thumbnail" className="mb-6 w-full rounded" />
      <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default BlogDetails;
