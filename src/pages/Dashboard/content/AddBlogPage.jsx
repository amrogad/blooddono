import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { createBlog, uploadBlogImage } from '../../../services/blogService';

const AddBlogPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let thumbnail = null;
      if (imageFile) {
        thumbnail = await uploadBlogImage(imageFile);
      }
      await createBlog({ title: data.title, thumbnail, content, status: 'draft' });

      Swal.fire({ icon: 'success', title: 'Blog created as draft!' });
      reset();
      setContent('');
      setImageFile(null);
      setPreview('');
      navigate('/dashboard/content-management-page');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Could not create blog', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register('title', { required: true })}
          className="input input-bordered w-full"
          placeholder="Blog Title"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input file-input-bordered w-full"
        />

        {preview && <img src={preview} alt="Thumbnail" className="w-32 mt-2" />}

        <textarea
          className="textarea w-full h-48"
          placeholder="Write your blog content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit" className="btn btn-neutral" disabled={saving}>
          {saving ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
