import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';
import { getBlog, updateBlog } from '../../../services/blogService';

const fieldClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      Swal.fire(t('content.updatedTitle'), t('content.updatedBody'), 'success');
      navigate('/dashboard/content-management-page');
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('dash.updateFailed'), text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center text-sm text-muted">
        {t('content.notFound')}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 font-display text-[28px] font-semibold tracking-tight text-ink">
        {t('content.editBlog')}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="edit-title" className={labelClass}>
            {t('content.title')}
          </label>
          <input
            id="edit-title"
            type="text"
            name="title"
            className={fieldClass}
            placeholder={t('content.titlePlaceholder')}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="edit-thumb" className={labelClass}>
            {t('content.thumbnailUrl')}
          </label>
          <input
            id="edit-thumb"
            type="text"
            name="thumbnail"
            className={fieldClass}
            placeholder={t('content.thumbnailUrl')}
            value={formData.thumbnail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="edit-content" className={labelClass}>
            {t('content.content')}
          </label>
          <textarea
            id="edit-content"
            name="content"
            className="min-h-48 w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15"
            placeholder={t('content.contentPlaceholder')}
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-12 items-center justify-center self-start rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep disabled:opacity-60"
        >
          {saving ? t('content.updating') : t('content.updateBlog')}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
