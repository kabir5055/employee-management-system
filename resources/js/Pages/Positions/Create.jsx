import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { showToast } from '@/utils/toast.jsx';

export default function Create() {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        name: '',
        description: '',
        min_salary: '',
        max_salary: '',
        level: 'entry',
        requirements: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const loadingToast = showToast.loading('Creating position...');

        post(route('positions.store'), {
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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create Position
                    </h2>
                </div>
            }
        >
            <Head title="Create Position" />

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
                                    <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Salary
                                    </label>
                                    <input
                                        type="number"
                                        id="min_salary"
                                        value={data.min_salary}
                                        onChange={(e) => setData('min_salary', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    {errors.min_salary && <p className="mt-1 text-sm text-red-600">{errors.min_salary}</p>}
                                </div>

                                <div>
                                    <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700 mb-2">
                                        Maximum Salary
                                    </label>
                                    <input
                                        type="number"
                                        id="max_salary"
                                        value={data.max_salary}
                                        onChange={(e) => setData('max_salary', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    {errors.max_salary && <p className="mt-1 text-sm text-red-600">{errors.max_salary}</p>}
                                </div>

                                {/* Level */}
                                <div>
                                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                                        Position Level *
                                    </label>
                                    <select
                                        id="level"
                                        value={data.level}
                                        onChange={(e) => setData('level', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="entry">Entry Level</option>
                                        <option value="junior">Junior</option>
                                        <option value="mid">Mid Level</option>
                                        <option value="senior">Senior</option>
                                        <option value="lead">Lead</option>
                                        <option value="manager">Manager</option>
                                        <option value="director">Director</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                    {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                                </div>

                                {/* Requirements */}
                                <div>
                                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                                        Requirements
                                    </label>
                                    <textarea
                                        id="requirements"
                                        value={data.requirements}
                                        onChange={(e) => setData('requirements', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter each requirement on a new line, e.g.:&#10;Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Strong communication skills"
                                    />
                                    {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
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
                                    href={route('positions.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Position'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
