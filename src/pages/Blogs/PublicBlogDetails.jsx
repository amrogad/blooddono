import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import Loading from '../../components/Loading';
import { getPublishedBlogs } from '../../services/blogService';
import { slugify } from '../../utils/slug';

const proseClass = [
  '[&_p]:mb-4 [&_p]:text-[16px] [&_p]:leading-relaxed [&_p]:text-body',
  '[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink',
  '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-ink',
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-6 [&_li]:mb-1.5 [&_li]:leading-relaxed [&_li]:text-body',
  '[&_strong]:font-semibold [&_strong]:text-ink',
  '[&_a]:font-medium [&_a]:text-crimson [&_a]:underline',
].join(' ');

const PublicBlogDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedBlogs()
      .then((blogs) => setBlog(blogs.find((b) => slugify(b.title) === slug) ?? null))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;

  if (!blog) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">{t('blog.notFound')}</h1>
        <Link
          to="/blogs"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-deep"
        >
          <LuArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
          {t('blog.backToBlogs')}
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <Link
        to="/blogs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-body transition hover:text-ink"
      >
        <LuArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
        {t('blog.allPosts')}
      </Link>
      <h1
        dir="auto"
        className="mt-5 font-display text-[36px] font-semibold leading-tight tracking-tight text-ink"
      >
        {blog.title}
      </h1>
      {blog.thumbnail && (
        <a
          href={blog.thumbnail}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block overflow-hidden rounded-2xl border border-line"
        >
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full cursor-zoom-in transition hover:opacity-95"
          />
        </a>
      )}
      <div
        dir="auto"
        className={`mt-8 ${proseClass}`}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
};

export default PublicBlogDetails;
