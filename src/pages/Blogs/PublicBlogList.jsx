import React from 'react';
import { Link } from 'react-router';

const sampleBlogs = [
  {
    _id: '1',
    title: 'Why Donating Blood Saves Lives in Cairo Hospitals',
    thumbnail: '/images/blog-1.jpg',
    content: '<p>Every year, thousands of patients in Cairo hospitals depend on blood donations to survive surgeries, accidents, and chronic illnesses. A single donation can help save up to three lives.</p><p>Local blood banks often run short during the summer months, which makes regular donors extremely valuable to the healthcare system.</p>',
    status: 'published',
    created_at: '2026-05-01T09:00:00',
  },
  {
    _id: '2',
    title: 'Common Myths About Blood Donation',
    thumbnail: '/images/blog-2.jpg',
    content: '<p>Many people avoid donating blood because of myths they have heard from friends or family. For example, donating blood does not make you weak or increase your risk of getting sick.</p><p>In reality, the donation process is quick, safe, and supervised by trained medical staff at every step.</p>',
    status: 'published',
    created_at: '2026-05-08T11:30:00',
  },
  {
    _id: '3',
    title: 'How Often Can You Donate Blood Safely?',
    thumbnail: '/images/blog-3.jpg',
    content: '<p>Most healthy adults can donate whole blood every 56 days, which is roughly eight times a year. Your body needs this time to replace the red blood cells that were removed.</p><p>Doctors recommend keeping a simple log of your donation dates so you do not accidentally donate too soon.</p>',
    status: 'draft',
    created_at: '2026-05-15T14:00:00',
  },
  {
    _id: '4',
    title: 'Preparing for Your First Blood Donation',
    thumbnail: '/images/blog-4.jpg',
    content: '<p>If this is your first time donating, a little preparation goes a long way. Eat a healthy meal, drink plenty of water, and get a good night of sleep before your appointment.</p><p>Bring a valid ID and try to wear a shirt with sleeves that can be rolled up easily.</p>',
    status: 'published',
    created_at: '2026-05-22T08:45:00',
  },
  {
    _id: '5',
    title: "Blood Types Explained: What's Your Type?",
    thumbnail: '/images/blog-5.jpg',
    content: '<p>There are eight main blood types, and knowing yours can be important in an emergency. Type O negative is known as the universal donor because it can be given to almost anyone.</p><p>Ask your local donation center to find out your blood type the next time you donate.</p>',
    status: 'draft',
    created_at: '2026-05-29T16:20:00',
  },
];

const PublicBlogList = () => {
  const blogs = sampleBlogs.filter((blog) => blog.status === 'published');

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Latest Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map(blog => (
            <div key={blog._id} className="card bg-base-100 shadow p-4">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="rounded mb-3 h-48 w-full object-cover"
              />
              <h3 className="text-xl font-semibold my-4">{blog.title}</h3>
              {/* <p className='truncate'>{blog.content}</p>
               */}

              <div
                className="prose max-w-full mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />


              <Link to={`/blogs/${blog._id}`} className="btn btn-neutral mt-2">
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
