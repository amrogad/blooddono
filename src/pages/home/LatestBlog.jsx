import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { LuArrowRight } from 'react-icons/lu';
import { getPublishedBlogs } from '../../services/blogService';

const LatestBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getPublishedBlogs()
      .then((data) => setBlogs(data.slice(0, 3)))
      .catch(() => setBlogs([]));
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1180px] px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-[27px] font-semibold tracking-tight text-ink">
            From the blog
          </h2>
          <Link
            to="/blogs"
            className="hidden items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-deep sm:inline-flex"
          >
            All posts
            <LuArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
              className="group overflow-hidden rounded-3xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(33,20,22,0.15)]"
            >
              <img src={blog.thumbnail} alt={blog.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-[16.5px] font-semibold leading-snug text-ink">{blog.title}</h3>
                <div
                  className="mt-2 line-clamp-2 text-sm leading-relaxed text-body"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
                  Read more
                  <LuArrowRight
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
