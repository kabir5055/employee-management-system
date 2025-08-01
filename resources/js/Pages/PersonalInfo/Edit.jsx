import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { showToast } from '@/utils/toast.jsx';
import {
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    IdentificationIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function Edit({ employee, departments, positions, districts, upazilas: initialUpazilas, thanas: initialThanas }) {
    const [upazilas, setUpazilas] = useState(initialUpazilas || []);
    const [thanas, setThanas] = useState(initialThanas || []);

    const { data, setData, put, processing, errors } = useForm({
        name: employee.name || '',
        email: employee.email || '',
        employee_id: employee.employee_id || '',
        phone: employee.phone || '',
        address: employee.address || '',
        date_of_birth: employee.date_of_birth ? new Date(employee.date_of_birth).toISOString().split('T')[0] : '',
        joining_date: employee.joining_date ? new Date(employee.joining_date).toISOString().split('T')[0] : '',
        department_id: employee.department_id || '',
        position_id: employee.position_id || '',
        nid: employee.nid || '',
        district_id: employee.district_id || '',
        upazila_id: employee.upazila_id || '',
        thana_id: employee.thana_id || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadingToast = showToast.loading('Updating employee information...');

        put(route('personal-info.update', { personal_info: employee.id }), {
            onSuccess: () => {
                showToast.dismiss(loadingToast);
                showToast.success('Employee information updated successfully!');
            },
            onError: () => {
                showToast.dismiss(loadingToast);
                if (Object.keys(errors).length > 0) {
                    showToast.error('Please check the form for errors');
                } else {
                    showToast.error('Failed to update employee information');
                }
            }
        });
    };

    const handleDistrictChange = async (districtId) => {
        setData('district_id', districtId);
        setData('upazila_id', '');
        setData('thana_id', '');
        setUpazilas([]);
        setThanas([]);

        if (districtId) {
            try {
                const response = await fetch(`/api/districts/${districtId}/upazilas`);
                if (response.ok) {
                    const data = await response.json();
                    setUpazilas(data);
                }
            } catch (error) {
                console.error('Error fetching upazilas:', error);
            }
        }
    };

    const handleUpazilaChange = async (upazilaId) => {
        setData('upazila_id', upazilaId);
        setData('thana_id', '');
        setThanas([]);

        if (upazilaId) {
            try {
                const response = await fetch(`/api/upazilas/${upazilaId}/thanas`);
                if (response.ok) {
                    const data = await response.json();
                    setThanas(data);
                }
            } catch (error) {
                console.error('Error fetching thanas:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('personal-info.index')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Employee Information - {employee.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit ${employee.name} Information`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Personal Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <UserIcon className="w-5 h-5" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter full name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Employee ID
                                        </label>
                                        <input
                                            type="text"
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.employee_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter employee ID"
                                        />
                                        {errors.employee_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.date_of_birth && (
                                            <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NID Number
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nid}
                                            onChange={(e) => setData('nid', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.nid ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter NID number"
                                        />
                                        {errors.nid && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nid}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <EnvelopeIcon className="w-5 h-5" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter email address"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter phone number"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={3}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter address"
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPinIcon className="w-5 h-5" />
                                    Location Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District
                                        </label>
                                        <select
                                            value={data.district_id}
                                            onChange={(e) => handleDistrictChange(e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.district_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select District</option>
                                            {districts?.map((district) => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.district_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.district_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upazila
                                        </label>
                                        <select
                                            value={data.upazila_id}
                                            onChange={(e) => handleUpazilaChange(e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.upazila_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            disabled={!data.district_id}
                                        >
                                            <option value="">Select Upazila</option>
                                            {upazilas.map((upazila) => (
                                                <option key={upazila.id} value={upazila.id}>
                                                    {upazila.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.upazila_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.upazila_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Thana
                                        </label>
                                        <select
                                            value={data.thana_id}
                                            onChange={(e) => setData('thana_id', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.thana_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            disabled={!data.upazila_id}
                                        >
                                            <option value="">Select Thana</option>
                                            {thanas.map((thana) => (
                                                <option key={thana.id} value={thana.id}>
                                                    {thana.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.thana_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.thana_id}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Employment Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <BriefcaseIcon className="w-5 h-5" />
                                    Employment Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department
                                        </label>
                                        <select
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.department_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select Department</option>
                                            {departments?.map((department) => (
                                                <option key={department.id} value={department.id}>
                                                    {department.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Position
                                        </label>
                                        <select
                                            value={data.position_id}
                                            onChange={(e) => setData('position_id', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.position_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select Position</option>
                                            {positions?.map((position) => (
                                                <option key={position.id} value={position.id}>
                                                    {position.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.position_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.position_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Joining Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.joining_date}
                                            onChange={(e) => setData('joining_date', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.joining_date ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.joining_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.joining_date}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6">
                                <Link
                                    href={route('personal-info.index')}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
