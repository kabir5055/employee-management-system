import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function ExpensesIndex({ auth, expenses }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filterErrors, setFilterErrors] = useState({});

    const handleSearch = () => {
        try {
            setIsLoading(true);
            setFilterErrors({});

            // Build query parameters - only include non-empty values
            const params = {};
            if (search.trim()) params.search = search.trim();
            if (category) params.category = category;
            if (status) params.status = status;

            router.get('/expenses', params, {
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: (errors) => {
                    setFilterErrors(errors);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Error applying filter:', error);
            setFilterErrors({ general: 'An error occurred while applying the filter' });
            setIsLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setStatus('');
        setFilterErrors({});

        router.get('/expenses', {}, {
            onSuccess: () => {
                setIsLoading(false);
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(`/expenses/${id}`);
        }
    };

    const handleApprove = (id) => {
        if (confirm('Are you sure you want to approve this expense?')) {
            router.post(`/expenses/${id}/approve`);
        }
    };

    const handleReject = (id) => {
        if (confirm('Are you sure you want to reject this expense?')) {
            router.post(`/expenses/${id}/reject`);
        }
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const getStatusBadge = (status) => {
        const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
        switch (status) {
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Expenses</h2>}
        >
            <Head title="Expenses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <h3 className="text-lg font-semibold text-gray-900">Expense Management</h3>
                                <Link
                                    href="/expenses/create"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Add Expense
                                </Link>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            {/* Show general error */}
                            {filterErrors.general && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-800 text-sm">{filterErrors.general}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Search <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search expenses... (optional)"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isLoading}
                                        />
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isLoading}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="transport">Transport</option>
                                        <option value="meals">Meals</option>
                                        <option value="office">Office Supplies</option>
                                        <option value="travel">Travel</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isLoading}
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div className="flex items-end space-x-2">
                                    <button
                                        onClick={handleSearch}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                                                Searching...
                                            </>
                                        ) : (
                                            'Search'
                                        )}
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        disabled={isLoading}
                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Active filter indicators */}
                            {(search || category || status) && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-blue-800 text-sm font-medium">Active Filters:</p>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {search && (
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Search: {search}
                                            </span>
                                        )}
                                        {category && (
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Category: {category}
                                            </span>
                                        )}
                                        {status && (
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Status: {status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {expenses.data && expenses.data.length > 0 ? (
                                        expenses.data.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {expense.employee?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {expense.employee?.employee_id || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm font-medium text-gray-900">
                                                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                        {formatCurrency(expense.amount)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                        {formatDate(expense.expense_date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getStatusBadge(expense.status)}>
                                                        {expense.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {expense.description || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={`/expenses/${expense.id}`}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                            title="View"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Link>

                                                        {/* Show approve/reject buttons for super admin on pending expenses */}
                                                        {auth.user.is_super_admin && expense.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(expense.id)}
                                                                    className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100"
                                                                    title="Approve"
                                                                >
                                                                    <CheckIcon className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(expense.id)}
                                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                                    title="Reject"
                                                                >
                                                                    <XMarkIcon className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        )}

                                                        <Link
                                                            href={`/expenses/${expense.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(expense.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="text-gray-500">
                                                    <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                    <h3 className="text-lg font-medium mb-2">No expenses found</h3>
                                                    <p className="text-sm">Get started by creating your first expense.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {expenses.data && expenses.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {expenses.from} to {expenses.to} of {expenses.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {expenses.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
