import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowLeftIcon,
    TagIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
    ClockIcon,
    EyeIcon,
    EyeSlashIcon,
    HashtagIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/utils/toast.jsx';

export default function Show({ auth, category, products }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        const loadingToast = showToast.loading('Deleting category...');

        router.delete(route('product-categories.destroy', category.id), {
            onSuccess: () => {
                showToast.dismiss(loadingToast);
                showToast.success('Category deleted successfully!');
            },
            onError: () => {
                showToast.dismiss(loadingToast);
                showToast.error('Failed to delete category');
                setDeleting(false);
                setShowDeleteModal(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('product-categories.index')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center">
                            <TagIcon className="w-6 h-6 mr-2" />
                            {category.name}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('product-categories.edit', category.id)}
                            className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Edit
                        </Link>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Category: ${category.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Category Details */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Category Image */}
                                <div className="lg:col-span-1">
                                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        {category.image ? (
                                            <img
                                                src={`/storage/${category.image}`}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
                                                <p>No Image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Category Information */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Category Details</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Name</label>
                                                <p className="text-gray-900 text-lg font-medium">{category.name}</p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Status</label>
                                                <div className="flex items-center mt-1">
                                                    {category.is_active ? (
                                                        <>
                                                            <EyeIcon className="w-4 h-4 text-green-600 mr-1" />
                                                            <span className="text-green-600 font-medium">Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeSlashIcon className="w-4 h-4 text-red-600 mr-1" />
                                                            <span className="text-red-600 font-medium">Inactive</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Sort Order</label>
                                                <div className="flex items-center mt-1">
                                                    <HashtagIcon className="w-4 h-4 text-gray-400 mr-1" />
                                                    <span className="text-gray-900">{category.sort_order}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-500">URL Slug</label>
                                                <p className="text-gray-900 font-mono text-sm">{category.slug}</p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Created Date</label>
                                                <div className="flex items-center mt-1">
                                                    <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                                                    <span className="text-gray-900">
                                                        {new Date(category.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                                <div className="flex items-center mt-1">
                                                    <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                                                    <span className="text-gray-900">
                                                        {new Date(category.updated_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {category.description && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Description</label>
                                            <p className="text-gray-900 mt-1 leading-relaxed">{category.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products in this Category */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <CubeIcon className="w-5 h-5 mr-2" />
                                    Products in this Category ({products?.length || 0})
                                </h3>
                                {products?.length > 0 && (
                                    <Link
                                        href={route('products.index', { category: category.slug })}
                                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                    >
                                        View All →
                                    </Link>
                                )}
                            </div>

                            {products?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stock
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {products.slice(0, 10).map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 w-10 h-10">
                                                                {product.image ? (
                                                                    <img
                                                                        src={`/storage/${product.image}`}
                                                                        alt={product.name}
                                                                        className="w-10 h-10 rounded-lg object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                        <CubeIcon className="w-5 h-5 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {product.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    SKU: {product.sku}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ${parseFloat(product.price || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {product.stock_quantity || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                            product.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {product.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <Link
                                                            href={route('products.show', product.id)}
                                                            className="text-indigo-600 hover:text-indigo-700"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <CubeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No products in this category yet.</p>
                                    <Link
                                        href={route('products.create', { category_id: category.id })}
                                        className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Add First Product
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <TrashIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Are you sure you want to delete "<strong>{category.name}</strong>"?
                                {products?.length > 0 && (
                                    <span className="text-red-600 block mt-2">
                                        This category has {products.length} product(s). They will be unassigned.
                                    </span>
                                )}
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? 'Deleting...' : 'Delete Category'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
