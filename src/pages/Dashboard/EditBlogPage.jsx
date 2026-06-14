import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

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

const EditBlogPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const blog = sampleBlogs.find((b) => b._id === id);

    const [formData, setFormData] = useState({
        title: blog?.title || '',
        thumbnail: blog?.thumbnail || '',
        content: blog?.content || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // no backend yet, just pretend it saved
        Swal.fire('Success', 'Blog updated successfully!', 'success');
        navigate('/dashboard/content-management-page');
    };

    if (!blog) {
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
                    defaultValue={formData.title}
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
                <button type="submit" className="btn btn-neutral">Update Blog</button>
            </form>
        </div>
    );
};

export default EditBlogPage;
