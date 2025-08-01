import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Edit({ auth, employee, departments, positions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        employee_id: employee.employee_id || '',
        department_id: employee.department_id || '',
        position_id: employee.position_id || '',
        hire_date: employee.joining_date ? new Date(employee.joining_date).toISOString().split('T')[0] : '',
        salary: employee.current_salary || '',
        status: employee.status || 'active',
        emergency_contact: employee.emergency_contact || '',
        notes: employee.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('employees.update', { employee: employee.id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Employee</h2>}
        >
            <Head title={`Edit Employee - ${employee.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('employees.show', { employee: employee.id })}
                                        className="inline-flex items-center px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-l"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Back
                                    </Link>
                                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                        <UserIcon className="w-8 h-8 mr-3" />
                                        Edit Employee
                                    </h1>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
                                                Emergency Contact
                                            </label>
                                            <input
                                                type="text"
                                                id="emergency_contact"
                                                value={data.emergency_contact}
                                                onChange={(e) => setData('emergency_contact', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.emergency_contact && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                Address
                                            </label>
                                            <textarea
                                                id="address"
                                                rows={3}
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                                                Employee ID *
                                            </label>
                                            <input
                                                type="text"
                                                id="employee_id"
                                                value={data.employee_id}
                                                onChange={(e) => setData('employee_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.employee_id && <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">
                                                Department *
                                            </label>
                                            <select
                                                id="department_id"
                                                value={data.department_id}
                                                onChange={(e) => setData('department_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((department) => (
                                                    <option key={department.id} value={department.id}>
                                                        {department.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="position_id" className="block text-sm font-medium text-gray-700">
                                                Position *
                                            </label>
                                            <select
                                                id="position_id"
                                                value={data.position_id}
                                                onChange={(e) => setData('position_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="">Select Position</option>
                                                {positions.map((position) => (
                                                    <option key={position.id} value={position.id}>
                                                        {position.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.position_id && <p className="mt-1 text-sm text-red-600">{errors.position_id}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">
                                                Joining Date
                                            </label>
                                            <input
                                                type="date"
                                                id="hire_date"
                                                value={data.hire_date}
                                                onChange={(e) => setData('hire_date', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.hire_date && <p className="mt-1 text-sm text-red-600">{errors.hire_date}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                                                Salary
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id="salary"
                                                value={data.salary}
                                                onChange={(e) => setData('salary', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            rows={4}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Any additional notes about the employee..."
                                        />
                                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-6 border-t">
                                    <Link
                                        href={route('employees.show', { employee: employee.id })}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Employee'}
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
