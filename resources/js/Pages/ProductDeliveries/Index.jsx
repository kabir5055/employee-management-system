import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    TruckIcon,
    CalendarDaysIcon,
    UserIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Index({ auth, deliveries }) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this delivery?')) {
            setProcessing(true);
            router.delete(`/product-deliveries/${id}`, {
                onFinish: () => setProcessing(false)
            });
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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Product Deliveries
                    </h2>
                    <Link
                        href="/product-deliveries/create"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Delivery
                    </Link>
                </div>
            }
        >
            <Head title="Product Deliveries" />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                                <TruckIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">{deliveries.total}</p>
                                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
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
                                    ৳{deliveries.data.reduce((sum, delivery) => sum + parseFloat(delivery.total_amount || 0), 0).toLocaleString()}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Total Value</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg">
                                <CalendarDaysIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    {deliveries.data.filter(d => d.status === 'pending').length}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                                <UserIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    {new Set(deliveries.data.map(d => d.employee?.id)).size}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deliveries Table */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Deliveries</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product & Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity & Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Delivery Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/30 divide-y divide-gray-200">
                                {deliveries.data.map((delivery) => (
                                    <tr key={delivery.id} className="hover:bg-white/50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {delivery.product?.name || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    by {delivery.employee?.name || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {delivery.quantity} units
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    @ ৳{parseFloat(delivery.unit_price || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                ৳{parseFloat(delivery.total_amount || 0).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(delivery.delivery_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(delivery.status)}`}>
                                                {delivery.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/product-deliveries/${delivery.id}`}
                                                    className="inline-flex items-center p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/product-deliveries/${delivery.id}/edit`}
                                                    className="inline-flex items-center p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(delivery.id)}
                                                    disabled={processing}
                                                    className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {deliveries.links && (
                        <div className="px-6 py-4 border-t border-white/20">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {deliveries.from || 0} to {deliveries.to || 0} of {deliveries.total || 0} results
                                </div>
                                <div className="flex space-x-1">
                                    {deliveries.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                                link.active
                                                    ? 'bg-indigo-500 text-white'
                                                    : link.url
                                                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {deliveries.data.length === 0 && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center">
                        <TruckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first product delivery.</p>
                        <Link
                            href={route('product-deliveries.create')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Create Delivery
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
