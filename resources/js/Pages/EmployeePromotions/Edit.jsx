import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function Edit({ auth, promotion, employees = [], positions, departments }) {
    const { data, setData, patch, processing, errors } = useForm({
        new_position_id: promotion?.new_position_id || '',
        new_department_id: promotion?.new_department_id || '',
        new_salary: promotion?.new_salary || '',
        promotion_type: promotion?.promotion_type || 'promotion',
        effective_date: promotion?.effective_date ? new Date(promotion.effective_date).toISOString().split('T')[0] : '',
        reason: promotion?.reason || '',
        notes: promotion?.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('employee-promotions.update', { employee_promotion: promotion.id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link
                        href={route('employee-promotions.show', { employee_promotion: promotion.id })}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center">
                        <TrophyIcon className="w-6 h-6 mr-2" />
                        Edit Employee Promotion
                    </h2>
                </div>
            }
        >
            <Head title="Edit Promotion" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Employee Information (Read-only) */}
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <h3 className="text-lg font-medium text-blue-900 mb-2">Employee Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Employee:</span>
                                            <p className="text-gray-900">{promotion?.user?.name || 'N/A'} - {promotion?.user?.employee_id || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Current Position:</span>
                                            <p className="text-gray-900">{promotion?.user?.position?.name || 'N/A'} (Level: {promotion?.user?.position?.level || 'N/A'})</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Department:</span>
                                            <p className="text-gray-900">{promotion?.user?.department?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Promotion Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Current Position (readonly) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Previous Position
                                        </label>
                                        <input
                                            type="text"
                                            value={promotion?.previous_position?.name || 'N/A'}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 focus:outline-none"
                                            disabled
                                        />
                                    </div>

                                    {/* New Position */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Position *
                                        </label>
                                        <select
                                            value={data.new_position_id}
                                            onChange={(e) => setData('new_position_id', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select New Position</option>
                                            {positions?.map((position) => (
                                                <option key={position.id} value={position.id}>
                                                    {position.name} (Level: {position.level})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.new_position_id && <p className="mt-1 text-sm text-red-600">{errors.new_position_id}</p>}
                                    </div>

                                    {/* New Department */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Department
                                        </label>
                                        <select
                                            value={data.new_department_id}
                                            onChange={(e) => setData('new_department_id', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Department (Keep current if empty)</option>
                                            {departments?.map((department) => (
                                                <option key={department.id} value={department.id}>
                                                    {department.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.new_department_id && <p className="mt-1 text-sm text-red-600">{errors.new_department_id}</p>}
                                    </div>

                                    {/* Effective Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Effective Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.effective_date}
                                            onChange={(e) => setData('effective_date', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.effective_date && <p className="mt-1 text-sm text-red-600">{errors.effective_date}</p>}
                                    </div>

                                    {/* Previous Salary */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Previous Salary
                                        </label>
                                        <input
                                            type="text"
                                            value={`৳${promotion?.previous_salary?.toLocaleString() || '0'}`}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 focus:outline-none"
                                            disabled
                                        />
                                    </div>

                                    {/* New Salary */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Salary
                                        </label>
                                        <input
                                            type="number"
                                            value={data.new_salary}
                                            onChange={(e) => setData('new_salary', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            step="0.01"
                                        />
                                        {errors.new_salary && <p className="mt-1 text-sm text-red-600">{errors.new_salary}</p>}
                                        {promotion?.previous_salary && data.new_salary && (
                                            <p className="mt-1 text-sm text-green-600">
                                                Salary change: ৳{(data.new_salary - promotion.previous_salary).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Promotion Type */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Promotion Type *
                                        </label>
                                        <select
                                            value={data.promotion_type}
                                            onChange={(e) => setData('promotion_type', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="promotion">Promotion</option>
                                            <option value="demotion">Demotion</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="salary_change">Salary Change</option>
                                        </select>
                                        {errors.promotion_type && <p className="mt-1 text-sm text-red-600">{errors.promotion_type}</p>}
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Reason for Promotion *
                                    </label>
                                    <textarea
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        rows="3"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe the reason for this promotion..."
                                        required
                                    />
                                    {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="2"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Any additional notes or comments..."
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('employee-promotions.show', { employee_promotion: promotion.id })}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Promotion'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
