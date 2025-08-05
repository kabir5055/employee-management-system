import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { showToast } from '@/utils/toast.jsx';

export default function Edit({ auth, unit }) {
    const { data, setData, put, processing, errors } = useForm({
        name: unit.name || '',
        short_name: unit.short_name || '',
        description: unit.description || '',
        is_active: unit.is_active ?? true,
        sort_order: unit.sort_order || 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const loadingToast = showToast.loading('Updating unit...');

        put(route('product-units.update', unit.id), {
            onSuccess: () => {
                showToast.dismiss(loadingToast);
                showToast.success('Unit updated successfully!');
            },
            onError: () => {
                showToast.dismiss(loadingToast);
                showToast.error('Failed to update unit');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('product-units.index')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center">
                        <ScaleIcon className="w-6 h-6 mr-2" />
                        Edit Unit: {unit.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit Unit: ${unit.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Unit Name */}
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="e.g., Piece, Kilogram, Liter"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Short Name */}
                                <div>
                                    <label htmlFor="short_name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Short Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="short_name"
                                        value={data.short_name}
                                        onChange={(e) => setData('short_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="e.g., pcs, kg, ltr"
                                        maxLength="10"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Abbreviation for the unit (max 10 characters)
                                    </p>
                                    {errors.short_name && <p className="mt-1 text-sm text-red-600">{errors.short_name}</p>}
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
                                        placeholder="Describe this unit of measurement..."
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Status */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Active Unit</span>
                                    </label>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Inactive units won't be available for selection in products
                                    </p>
                                    {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>}
                                </div>
                            </div>

                            {/* Unit Info */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Unit Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Created:</span>
                                        <div>{new Date(unit.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span>
                                        <div>{new Date(unit.updated_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex justify-end gap-4">
                                <Link
                                    href={route('product-units.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Unit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
