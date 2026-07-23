import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { createBlog, uploadBlogImage } from '../../../services/blogService';

const fieldClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';

const AddBlogPage = () => {
  const { t } = useTranslation();
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
      if (imageFile) thumbnail = await uploadBlogImage(imageFile);
      await createBlog({ title: data.title, thumbnail, content, status: 'draft' });

      Swal.fire({ icon: 'success', title: t('content.created') });
      reset();
      setContent('');
      setImageFile(null);
      setPreview('');
      navigate('/dashboard/content-management-page');
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('content.createError'), text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 font-display text-[28px] font-semibold tracking-tight text-ink">
        {t('content.newBlog')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="blog-title" className={labelClass}>
            {t('content.title')}
          </label>
          <input
            id="blog-title"
            type="text"
            {...register('title', { required: true })}
            className={fieldClass}
            placeholder={t('content.titlePlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="blog-thumb" className={labelClass}>
            {t('content.thumbnail')}
          </label>
          <input
            id="blog-thumb"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {preview && <img src={preview} alt="" className="mt-3 h-24 rounded-xl object-cover" />}
        </div>

        <div>
          <label htmlFor="blog-content" className={labelClass}>
            {t('content.content')}
          </label>
          <textarea
            id="blog-content"
            className="min-h-48 w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15"
            placeholder={t('content.contentPlaceholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-12 items-center justify-center self-start rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep disabled:opacity-60"
        >
          {saving ? t('content.creating') : t('content.createBlog')}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
