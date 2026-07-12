import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { LuArrowLeft } from 'react-icons/lu';
import Loading from '../../components/Loading';
import { getBlog } from '../../services/blogService';

const proseClass = [
  '[&_p]:mb-4 [&_p]:text-[16px] [&_p]:leading-relaxed [&_p]:text-body',
  '[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink',
  '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-ink',
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1.5 [&_li]:leading-relaxed [&_li]:text-body',
  '[&_strong]:font-semibold [&_strong]:text-ink',
  '[&_a]:font-medium [&_a]:text-crimson [&_a]:underline',
].join(' ');

const PublicBlogDetails = () => {
  const { id } = useParams();
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
      <div className="mx-auto min-h-screen max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Post not found</h1>
        <Link
          to="/blogs"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-deep"
        >
          <LuArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to blogs
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
        <LuArrowLeft className="h-4 w-4" strokeWidth={2} />
        All posts
      </Link>
      <h1 className="mt-5 font-display text-[36px] font-semibold leading-tight tracking-tight text-ink">
        {blog.title}
      </h1>
      <img src={blog.thumbnail} alt="" className="mt-6 h-72 w-full rounded-2xl object-cover" />
      <div className={`mt-8 ${proseClass}`} dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
};

export default PublicBlogDetails;
