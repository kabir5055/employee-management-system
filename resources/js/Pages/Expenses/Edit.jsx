import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ExpensesEdit({ auth, expense, warehouses }) {
    const { data, setData, put, processing, errors } = useForm({
        warehouse_id: expense.warehouse_id || '',
        amount: expense.amount || '',
        category: expense.category || '',
        description: expense.description || '',
        expense_date: expense.expense_date || '',
        receipt_image: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data before submit:', data);
        console.log('Expense ID:', expense.id);
        console.log('URL:', `/expenses/${expense.id}`);

        put(`/expenses/${expense.id}`, data, {
            forceFormData: true,
            onSuccess: (response) => {
                console.log('Update successful:', response);
            },
            onError: (errors) => {
                console.log('Update errors:', errors);
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    const categories = [
        { value: 'marketing', label: 'Marketing' },
        { value: 'transport', label: 'Transport' },
        { value: 'meals', label: 'Meals' },
        { value: 'office', label: 'Office Supplies' },
        { value: 'travel', label: 'Travel' },
        { value: 'other', label: 'Other' }
    ];

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Expense</h2>}
        >
            <Head title={`Edit Expense #${expense.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Edit Expense #{expense.id}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Created on {formatDate(expense.created_at)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('expenses.show', expense.id)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        href={route('expenses.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Form Fields */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Warehouse */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Warehouse <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.warehouse_id}
                                                onChange={(e) => setData('warehouse_id', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.warehouse_id ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                                required
                                            >
                                                <option value="">Select Warehouse</option>
                                                {warehouses.map((warehouse) => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name} - {warehouse.thana?.upazila?.district?.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.warehouse_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.warehouse_id}</p>
                                            )}
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.category ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.value} value={category.value}>
                                                        {category.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && (
                                                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Amount (৳) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.amount ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                                placeholder="0.00"
                                                required
                                            />
                                            {errors.amount && (
                                                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                            )}
                                        </div>

                                        {/* Expense Date */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expense Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={data.expense_date}
                                                onChange={(e) => setData('expense_date', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.expense_date ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                                required
                                            />
                                            {errors.expense_date && (
                                                <p className="mt-1 text-sm text-red-600">{errors.expense_date}</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={4}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                                placeholder="Enter expense description..."
                                                required
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                            )}
                                        </div>

                                        {/* Receipt Image */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Receipt Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('receipt_image', e.target.files[0])}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.receipt_image ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.receipt_image && (
                                                <p className="mt-1 text-sm text-red-600">{errors.receipt_image}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Upload a new receipt image to replace the existing one. Max size: 2MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Current Details */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-4">Current Expense Details</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Current Amount:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(expense.amount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Current Category:</span>
                                                <span className="text-sm font-medium text-gray-900 capitalize">
                                                    {expense.category}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Current Date:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatDate(expense.expense_date)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Status:</span>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                                    expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {expense.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Receipt Image */}
                                    {expense.receipt_image && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Current Receipt Image</h4>
                                            <div className="mt-2">
                                                <img
                                                    src={`/storage/${expense.receipt_image}`}
                                                    alt="Current Receipt"
                                                    className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200 mt-8">
                                <Link
                                    href={`/expenses/${expense.id}`}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
