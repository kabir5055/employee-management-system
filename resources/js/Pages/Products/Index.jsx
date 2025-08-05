import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, products }) {
    const { delete: destroy } = useForm();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const deleteProduct = (product) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', { product: product.id }));
        }
    };

    const getStatusBadgeClass = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getProductImage = (product) => {
        if (product.primary_image) {
            return `/storage/${product.primary_image}`;
        }
        if (product.images && product.images.length > 0) {
            return `/storage/${product.images[0]}`;
        }
        return '/images/no-image.svg';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Products</h2>
                                <Link
                                    href={route('products.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Create Product
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TP Price</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP Price</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 border-b">
                                                    <img
                                                        src={getProductImage(product)}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            e.target.src = '/images/no-image.svg';
                                                        }}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm font-medium text-gray-900">
                                                    {product.sku}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-xs text-gray-500">{product.unit?.name}</div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    {product.category?.name || 'No Category'}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    {product.cost_price ? formatCurrency(product.cost_price) : '-'}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    {product.tp_price ? formatCurrency(product.tp_price) : '-'}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    {product.mrp_price ? formatCurrency(product.mrp_price) : '-'}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <PhotoIcon className="w-4 h-4 mr-1 text-gray-400" />
                                                        <span>{product.images ? product.images.length : 0}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(product.status)}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={route('products.edit', { product: product.id })}
                                                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                        >
                                                            <PencilIcon className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteProduct(product)}
                                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                        >
                                                            <TrashIcon className="w-4 h-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={products.links} className="mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
