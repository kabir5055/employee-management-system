import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    PencilIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    MapPinIcon,
    UserIcon,
    TagIcon,
    DocumentTextIcon,
    PhotoIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function ExpensesShow({ auth, expense }) {
    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this expense?')) {
            router.post(`/expenses/${expense.id}/approve`);
        }
    };

    const handleReject = () => {
        if (confirm('Are you sure you want to reject this expense?')) {
            router.post(`/expenses/${expense.id}/reject`);
        }
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full';
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Expense Details</h2>}
        >
            <Head title={`Expense #${expense.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Expense #{expense.id}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Created on {formatDate(expense.created_at)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={getStatusBadge(expense.status)}>
                                        {expense.status}
                                    </span>

                                    {/* Show approve/reject buttons for super admin on pending expenses */}
                                    {auth.user.is_super_admin && expense.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={handleApprove}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                <CheckIcon className="h-4 w-4 mr-2" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={handleReject}
                                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <XMarkIcon className="h-4 w-4 mr-2" />
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    <Link
                                        href={`/expenses/${expense.id}/edit`}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                    <Link
                                        href="/expenses"
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Employee Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            Employee Information
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Name:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {expense.employee?.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Employee ID:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {expense.employee?.employee_id || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Email:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {expense.employee?.email || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warehouse Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            Warehouse Information
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Name:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {expense.warehouse?.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Location:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {expense.warehouse?.thana?.upazila?.district?.name || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Expense Details */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                            <CurrencyDollarIcon className="h-5 w-5 text-blue-500 mr-2" />
                                            Expense Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Amount:</span>
                                                <span className="text-xl font-bold text-blue-600">
                                                    {formatCurrency(expense.amount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Category:</span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                    <TagIcon className="h-3 w-3 mr-1" />
                                                    {expense.category}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Date:</span>
                                                <span className="text-sm font-medium text-gray-900 flex items-center">
                                                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                    {formatDate(expense.expense_date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Receipt Image */}
                                    {expense.receipt_image && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                                <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                Receipt Image
                                            </h4>
                                            <div className="mt-2">
                                                <img
                                                    src={`/storage/${expense.receipt_image}`}
                                                    alt="Receipt"
                                                    className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-8 bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    Description
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {expense.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Timestamps */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                        <span className="font-medium">Created:</span> {formatDate(expense.created_at)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span> {formatDate(expense.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
