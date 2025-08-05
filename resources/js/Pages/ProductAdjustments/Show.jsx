import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ArrowLeftIcon, PencilIcon, CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, adjustment }) {
    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this adjustment? This will update the product stock.')) {
            router.post(route('product-adjustments.approve', adjustment.id));
        }
    };

    const handleReject = () => {
        if (confirm('Are you sure you want to reject this adjustment?')) {
            router.post(route('product-adjustments.reject', adjustment.id));
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this adjustment?')) {
            router.delete(route('product-adjustments.destroy', adjustment.id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getTypeBadge = (type) => {
        return type === 'increase'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Adjustment Details</h2>}
        >
            <Head title={`Adjustment ${adjustment.reference_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Adjustment Details
                                    </h2>
                                    <p className="text-lg text-gray-600 mt-1">
                                        Reference: <span className="font-medium">{adjustment.reference_number}</span>
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('product-adjustments.index')}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Back to Adjustments
                                    </Link>
                                </div>
                            </div>

                            {/* Status and Actions */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(adjustment.status)}`}>
                                            {adjustment.status.charAt(0).toUpperCase() + adjustment.status.slice(1)}
                                        </span>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeBadge(adjustment.type)}`}>
                                            {adjustment.type.charAt(0).toUpperCase() + adjustment.type.slice(1)}
                                        </span>
                                    </div>
                                    {adjustment.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <Link
                                                href={route('product-adjustments.edit', adjustment.id)}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200"
                                            >
                                                <PencilIcon className="w-4 h-4 mr-1" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={handleApprove}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200"
                                            >
                                                <CheckIcon className="w-4 h-4 mr-1" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={handleReject}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200"
                                            >
                                                <XMarkIcon className="w-4 h-4 mr-1" />
                                                Reject
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200"
                                            >
                                                <TrashIcon className="w-4 h-4 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Adjustment Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Product Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Product Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{adjustment.product.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">SKU</label>
                                            <p className="mt-1 text-sm text-gray-900">{adjustment.product.sku}</p>
                                        </div>
                                        {adjustment.product.category && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                <p className="mt-1 text-sm text-gray-900">{adjustment.product.category.name}</p>
                                            </div>
                                        )}
                                        {adjustment.product.unit && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Unit</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {adjustment.product.unit.name} ({adjustment.product.unit.short_name})
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Adjustment Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Adjustment Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
                                            <p className={`mt-1 text-sm font-semibold ${adjustment.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                                {adjustment.type.charAt(0).toUpperCase() + adjustment.type.slice(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Quantity Adjusted</label>
                                            <p className={`mt-1 text-lg font-bold ${adjustment.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                                {adjustment.type === 'increase' ? '+' : '-'}{adjustment.quantity_adjusted}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Stock Change</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {adjustment.old_quantity} → {adjustment.new_quantity}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reason</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {adjustment.reason.charAt(0).toUpperCase() + adjustment.reason.slice(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Adjustment Date</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(adjustment.adjustment_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {adjustment.notes && (
                                <div className="mb-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{adjustment.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Audit Trail */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Created By */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Created By</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">User</label>
                                            <p className="mt-1 text-sm text-gray-900">{adjustment.user?.name || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(adjustment.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Approval Information */}
                                {(adjustment.status === 'approved' || adjustment.status === 'rejected') && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                                            {adjustment.status === 'approved' ? 'Approved By' : 'Rejected By'}
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">User</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {adjustment.approved_by ? adjustment.approved_by.name : 'Unknown'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {adjustment.approved_at ? new Date(adjustment.approved_at).toLocaleString() : 'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
