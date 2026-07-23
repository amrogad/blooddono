import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LuArrowRight } from 'react-icons/lu';
import Loading from '../../components/Loading';
import { getPublishedBlogs } from '../../services/blogService';
import { slugify } from '../../utils/slug';

const excerpt = (html, n = 140) =>
  (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, n);

const PublicBlogList = () => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-[1180px] px-6 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        {t('blog.title')}
      </h1>
      <p className="mb-8 mt-1.5 text-sm text-muted">{t('blog.subtitle')}</p>

      {loading ? (
        <Loading />
      ) : blogs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-card p-10 text-center text-sm text-muted">
          {t('blog.empty')}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${slugify(blog.title)}`}
              className="group overflow-hidden rounded-3xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(33,20,22,0.15)]"
            >
              <img src={blog.thumbnail} alt="" className="h-48 w-full object-cover" />
              <div className="p-5">
                <h2 dir="auto" className="text-[17px] font-semibold leading-snug text-ink">
                  {blog.title}
                </h2>
                <p dir="auto" className="mt-2 line-clamp-2 text-sm leading-relaxed text-body">
                  {excerpt(blog.content)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
                  {t('blog.readMore')}
                  <LuArrowRight
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 rtl:-scale-x-100"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicBlogList;
