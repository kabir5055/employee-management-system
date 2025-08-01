import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { showToast } from '@/utils/toast.jsx';

export default function Edit({ position }) {
    const { errors } = usePage().props;

    const { data, setData, patch, processing } = useForm({
        name: position.name || '',
        description: position.description || '',
        salary_range_min: position.salary_range_min || '',
        salary_range_max: position.salary_range_max || '',
        is_active: position.is_active || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const loadingToast = showToast.loading('Updating position...');

        patch(route('positions.update', { position: position.id }), {
            onFinish: () => {
                showToast.dismiss(loadingToast);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('positions.index')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Edit Position: {position.name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Position: ${position.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Position Name */}
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Position Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="e.g., Software Engineer, HR Manager"
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
                                        placeholder="Describe the position responsibilities and requirements..."
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Salary Range */}
                                <div>
                                    <label htmlFor="salary_range_min" className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Salary
                                    </label>
                                    <input
                                        type="number"
                                        id="salary_range_min"
                                        value={data.salary_range_min}
                                        onChange={(e) => setData('salary_range_min', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    {errors.salary_range_min && <p className="mt-1 text-sm text-red-600">{errors.salary_range_min}</p>}
                                </div>

                                <div>
                                    <label htmlFor="salary_range_max" className="block text-sm font-medium text-gray-700 mb-2">
                                        Maximum Salary
                                    </label>
                                    <input
                                        type="number"
                                        id="salary_range_max"
                                        value={data.salary_range_max}
                                        onChange={(e) => setData('salary_range_max', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    {errors.salary_range_max && <p className="mt-1 text-sm text-red-600">{errors.salary_range_max}</p>}
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
                                        <span className="ml-2 text-sm text-gray-700">Active Position</span>
                                    </label>
                                    {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex justify-end gap-4">
                                <Link
                                    href={route('positions.show', { position: position.id })}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Position'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
