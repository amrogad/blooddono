import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const AddBlogPage = () => {
    const { register, handleSubmit, reset } = useForm();
    const [content, setContent] = useState('');
    const [imageURL, setImageURL] = useState('');
    const navigate = useNavigate();

    const onSubmit = () => {
        // no backend yet, just show a success message and go back to the list
        Swal.fire({
            icon: 'success',
            title: 'Blog created as draft!',
        });

        reset();
        setContent('');
        setImageURL('');
        navigate('/dashboard/content-management-page');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageURL(URL.createObjectURL(file));
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

                {imageURL && <img src={imageURL} alt="Thumbnail" className="w-32 mt-2" />}

                <textarea
                    className="textarea w-full h-48"
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type="submit" className="btn btn-neutral">Create Blog</button>
            </form>
        </div>
    );
};

export default AddBlogPage;
