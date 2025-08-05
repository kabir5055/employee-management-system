import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Avatar from '@/Components/Avatar';
import { showToast } from '@/utils/toast.jsx';
import {
    MagnifyingGlassIcon,
    UserPlusIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    UserIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Index({ users, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, status }, {
            preserveState: true,
            replace: true
        });
    };

    const handleFilter = (filterType, value) => {
        const params = { search };
        if (filterType === 'status') {
            params.status = value === status ? '' : value;
        }

        router.get(route('admin.users.index'), params, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (user) => {
        showToast.confirmDelete(`user "${user.name}"`, () => {
            const loadingToast = showToast.loading('Deleting user...');
            router.delete(route('admin.users.destroy', { user: user.id }), {
                onFinish: () => {
                    showToast.dismiss(loadingToast);
                }
            });
        });
    };

    const handleToggleStatus = (user) => {
        const action = user.status === 'active' ? 'deactivate' : 'activate';
        const loadingToast = showToast.loading(`${action === 'activate' ? 'Activating' : 'Deactivating'} user...`);

        router.patch(route('admin.users.toggle-status', { user: user.id }), {}, {
            onFinish: () => {
                showToast.dismiss(loadingToast);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        User Management
                    </h2>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <UserPlusIcon className="w-4 h-4 mr-2" />
                        Add User
                    </Link>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search and Filters */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <form onSubmit={handleSearch} className="flex-1">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search users by name, email, or employee ID..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </form>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleFilter('status', 'active')}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            status === 'active'
                                                ? 'bg-green-100 text-green-800 border border-green-300'
                                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFilter('status', 'inactive')}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            status === 'inactive'
                                                ? 'bg-red-100 text-red-800 border border-red-300'
                                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        Inactive
                                    </button>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data?.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <Avatar
                                                                user={user}
                                                                size="md"
                                                                fallbackType="initials"
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                                {user.is_super_admin && (
                                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                        Super Admin
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.employee_id || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.department?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleToggleStatus(user)}
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            user.status === 'active'
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                    >
                                                        {user.status === 'active' ? (
                                                            <>
                                                                <CheckIcon className="w-3 h-3 mr-1" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XMarkIcon className="w-3 h-3 mr-1" />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.joining_date ? new Date(user.joining_date).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route('admin.users.show', { user: user.id })}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.users.edit', { user: user.id })}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </Link>
                                                        {!user.is_super_admin && (
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.links && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {users.from} to {users.to} of {users.total} results
                                    </div>
                                    <div className="flex gap-1">
                                        {users.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-md ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                preserveState
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
