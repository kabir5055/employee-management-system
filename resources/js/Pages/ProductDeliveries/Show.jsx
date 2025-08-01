import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    PencilIcon,
    TruckIcon,
    UserIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, delivery }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'cancelled':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };

        return statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/product-deliveries"
                            className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Delivery Details
                        </h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href={`/product-deliveries/${delivery.id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Delivery
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Delivery #${delivery.id}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Status Header */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                                <TruckIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Delivery #{delivery.id}
                                </h1>
                                <p className="text-gray-600">
                                    Created on {new Date(delivery.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(delivery.status)}
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadge(delivery.status)}`}>
                                {delivery.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                                <TruckIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">{delivery.quantity}</p>
                                <p className="text-sm font-medium text-gray-600">Units</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                                <CurrencyDollarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    ৳{parseFloat(delivery.unit_price || 0).toLocaleString()}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Unit Price</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                                <CurrencyDollarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    ৳{parseFloat(delivery.total_amount || 0).toLocaleString()}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                                <CalendarDaysIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    {new Date(delivery.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Delivery Date</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Information */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/20">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <TruckIcon className="h-5 w-5 mr-2" />
                                Product Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Product Name</label>
                                <p className="text-lg font-semibold text-gray-800">
                                    {delivery.product?.name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Product Code</label>
                                <p className="text-gray-800">
                                    {delivery.product?.code || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                                <p className="text-gray-800">
                                    {delivery.product?.category || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Current Stock</label>
                                <p className="text-gray-800">
                                    {delivery.product?.stock_quantity || 0} units
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Employee Information */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/20">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2" />
                                Employee Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Employee Name</label>
                                <p className="text-lg font-semibold text-gray-800">
                                    {delivery.employee?.name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                                <p className="text-gray-800">
                                    {delivery.employee?.employee_id || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Position</label>
                                <p className="text-gray-800">
                                    {delivery.employee?.position?.name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Contact</label>
                                <p className="text-gray-800">
                                    {delivery.employee?.phone || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                            Delivery Details
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Delivery Date</label>
                                <p className="text-lg font-semibold text-gray-800">
                                    {new Date(delivery.delivery_date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(delivery.status)}
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadge(delivery.status)}`}>
                                        {delivery.status}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                                <p className="text-lg font-semibold text-gray-800">
                                    {delivery.quantity} units
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Unit Price</label>
                                <p className="text-lg font-semibold text-gray-800">
                                    ৳{parseFloat(delivery.unit_price || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {delivery.notes && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-800 whitespace-pre-wrap">
                                        {delivery.notes}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/product-deliveries"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Deliveries
                    </Link>
                    <div className="flex items-center space-x-3">
                        <Link
                            href={`/product-deliveries/${delivery.id}/edit`}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Delivery
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
