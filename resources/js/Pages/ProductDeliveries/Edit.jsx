import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    TruckIcon,
    CalendarDaysIcon,
    UserIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Edit({ auth, delivery, products, employees }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        employee_id: delivery.employee_id || '',
        product_id: delivery.product_id || '',
        quantity: delivery.quantity || '',
        unit_price: delivery.unit_price || '',
        delivery_date: delivery.delivery_date ? delivery.delivery_date.split('T')[0] : '',
        notes: delivery.notes || '',
        status: delivery.status || 'pending'
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (data.product_id && products) {
            const product = products.find(p => p.id == data.product_id);
            setSelectedProduct(product);
        }
    }, [data.product_id]);

    useEffect(() => {
        const quantity = parseFloat(data.quantity) || 0;
        const unitPrice = parseFloat(data.unit_price) || 0;
        setTotalAmount(quantity * unitPrice);
    }, [data.quantity, data.unit_price]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/product-deliveries/${delivery.id}`);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/product-deliveries/${delivery.id}`}
                            className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Edit Delivery #{delivery.id}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Delivery #${delivery.id}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Summary Card */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                                <TruckIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Product</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {selectedProduct?.name || delivery.product?.name || 'Select Product'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                                <CurrencyDollarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-lg font-bold text-gray-800">
                                    ৳{totalAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                                <UserIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Available Stock</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {selectedProduct?.stock_quantity || delivery.product?.stock_quantity || 0} units
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                                <CalendarDaysIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Status</p>
                                <p className="text-lg font-bold text-gray-800 capitalize">
                                    {data.status}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800">Update Delivery Details</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Employee Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Employee *
                                </label>
                                <select
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees && employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name} - {employee.position?.name || 'No Position'}
                                        </option>
                                    ))}
                                </select>
                                {errors.employee_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
                                )}
                            </div>

                            {/* Product Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product *
                                </label>
                                <select
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products && products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} (Stock: {product.stock_quantity})
                                        </option>
                                    ))}
                                </select>
                                {errors.product_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter quantity"
                                    required
                                />
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                                )}
                                {selectedProduct && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Available: {selectedProduct.stock_quantity} units
                                    </p>
                                )}
                            </div>

                            {/* Unit Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit Price (৳) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.unit_price}
                                    onChange={(e) => setData('unit_price', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter unit price"
                                    required
                                />
                                {errors.unit_price && (
                                    <p className="mt-1 text-sm text-red-600">{errors.unit_price}</p>
                                )}
                            </div>

                            {/* Delivery Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.delivery_date}
                                    onChange={(e) => setData('delivery_date', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                                {errors.delivery_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.delivery_date}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        {/* Total Amount Display */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Amount
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-lg font-bold text-gray-800">
                                    ৳{totalAmount.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="Add any delivery notes or instructions..."
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <Link
                                href={`/product-deliveries/${delivery.id}`}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || !data.employee_id || !data.product_id || !data.quantity || !data.unit_price}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {processing ? 'Updating...' : 'Update Delivery'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
