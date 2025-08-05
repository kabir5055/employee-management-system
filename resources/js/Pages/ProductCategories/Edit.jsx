import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline';
import { showToast } from '@/utils/toast.jsx';

export default function Edit({ auth, category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        image: null,
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0
    });

    const [imagePreview, setImagePreview] = React.useState(
        category.image ? `/storage/${category.image}` : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(category.image ? `/storage/${category.image}` : null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const loadingToast = showToast.loading('Updating category...');

        put(route('product-categories.update', category.id), {
            onSuccess: () => {
                showToast.dismiss(loadingToast);
                showToast.success('Category updated successfully!');
            },
            onError: () => {
                showToast.dismiss(loadingToast);
                showToast.error('Failed to update category');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('product-categories.index')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center">
                        <TagIcon className="w-6 h-6 mr-2" />
                        Edit Category: {category.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Category: ${category.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6" encType="multipart/form-data">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category Name */}
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="e.g., Electronics, Clothing, Books"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Describe this category and what products it contains..."
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Category Image */}
                                <div className="md:col-span-2">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Image
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                id="image"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                PNG, JPG, GIF up to 2MB. Leave empty to keep current image.
                                            </p>
                                        </div>

                                        {imagePreview && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        id="sort_order"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                        placeholder="0"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Lower numbers appear first
                                    </p>
                                    {errors.sort_order && <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Active Category</span>
                                    </label>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Inactive categories won't be shown in product listings
                                    </p>
                                    {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>}
                                </div>
                            </div>

                            {/* Category Info */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Category Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Created:</span>
                                        <div>{new Date(category.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span>
                                        <div>{new Date(category.updated_at).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">URL Slug:</span>
                                        <div className="font-mono text-xs">{category.slug}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex justify-end gap-4">
                                <Link
                                    href={route('product-categories.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
