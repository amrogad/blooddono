import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Loading from '../shared/Loading';
import { getBlog, updateBlog } from '../../services/blogService';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', thumbnail: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBlog(id)
      .then((blog) =>
        setFormData({
          title: blog.title || '',
          thumbnail: blog.thumbnail || '',
          content: blog.content || '',
        }),
      )
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBlog(id, formData);
      Swal.fire('Success', 'Blog updated successfully!', 'success');
      navigate('/dashboard/content-management-page');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          className="input input-bordered w-full"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="thumbnail"
          className="input input-bordered w-full"
          placeholder="Thumbnail URL"
          value={formData.thumbnail}
          onChange={handleChange}
          required
        />
        <textarea
          className="textarea w-full h-48"
          name="content"
          placeholder="Write your blog content here..."
          value={formData.content}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-neutral" disabled={saving}>
          {saving ? 'Updating...' : 'Update Blog'}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
