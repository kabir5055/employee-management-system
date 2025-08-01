import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
    BriefcaseIcon,
    PencilSquareIcon,
    TrashIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function Show({ employee }) {
    const handleDelete = () => {
        showToast.confirmDelete(`employee "${employee.name}"`, () => {
            const loadingToast = showToast.loading('Deleting employee...');
            router.delete(route('personal-info.destroy', { personal_info: employee.id }), {
                onFinish: () => {
                    showToast.dismiss(loadingToast);
                }
            });
        });
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('en-US') : 'Not set';
    };

    const InfoCard = ({ title, icon: Icon, children }) => (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {title}
            </h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{label}:</span>
            <span className="text-sm text-gray-900">{value || 'Not set'}</span>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('personal-info.index')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Employee Information - {employee.name}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('personal-info.edit', { personal_info: employee.id })}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${employee.name} Information`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Employee Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">
                                            {employee.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                                    <p className="text-lg text-gray-600">
                                        {employee.position?.name || 'No position assigned'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Employee ID: {employee.employee_id || 'Not set'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Department</div>
                                    <div className="text-lg font-medium text-gray-900">
                                        {employee.department?.name || 'No department'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <InfoCard title="Personal Information" icon={UserIcon}>
                            <InfoRow label="Full Name" value={employee.name} />
                            <InfoRow label="Employee ID" value={employee.employee_id} />
                            <InfoRow label="Date of Birth" value={formatDate(employee.date_of_birth)} />
                            <InfoRow label="NID Number" value={employee.nid} />
                        </InfoCard>

                        {/* Contact Information */}
                        <InfoCard title="Contact Information" icon={EnvelopeIcon}>
                            <InfoRow label="Email Address" value={employee.email} />
                            <InfoRow label="Phone Number" value={employee.phone} />
                            <div className="pt-2">
                                <div className="text-sm font-medium text-gray-500 mb-1">Address:</div>
                                <div className="text-sm text-gray-900 bg-white p-3 rounded border">
                                    {employee.address || 'Not set'}
                                </div>
                            </div>
                        </InfoCard>

                        {/* Location Information */}
                        <InfoCard title="Location Information" icon={MapPinIcon}>
                            <InfoRow label="District" value={employee.district?.name} />
                            <InfoRow label="Upazila" value={employee.upazila?.name} />
                            <InfoRow label="Thana" value={employee.thana?.name} />
                        </InfoCard>

                        {/* Employment Information */}
                        <InfoCard title="Employment Information" icon={BriefcaseIcon}>
                            <InfoRow label="Department" value={employee.department?.name} />
                            <InfoRow label="Position" value={employee.position?.name} />
                            <InfoRow label="Joining Date" value={formatDate(employee.joining_date)} />
                            <div className="pt-2">
                                <div className="text-sm font-medium text-gray-500">Salary Range:</div>
                                <div className="text-sm text-gray-900">
                                    {employee.position?.min_salary && employee.position?.max_salary
                                        ? `$${Number(employee.position.min_salary).toLocaleString()} - $${Number(employee.position.max_salary).toLocaleString()}`
                                        : 'Not defined'
                                    }
                                </div>
                            </div>
                        </InfoCard>
                    </div>

                    {/* Department Details */}
                    {employee.department && (
                        <div className="mt-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <BuildingOfficeIcon className="w-5 h-5" />
                                        Department Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Department Name</div>
                                            <div className="text-lg text-gray-900">{employee.department.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Department Head</div>
                                            <div className="text-lg text-gray-900">
                                                {employee.department.head_of_department || 'Not assigned'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Department Budget</div>
                                            <div className="text-lg text-gray-900">
                                                {employee.department.budget
                                                    ? `$${Number(employee.department.budget).toLocaleString()}`
                                                    : 'Not set'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {employee.department.description && (
                                        <div className="mt-4">
                                            <div className="text-sm font-medium text-gray-500 mb-2">Description</div>
                                            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                                {employee.department.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Information */}
                    <div className="mt-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <div className="text-gray-500">Created At:</div>
                                        <div className="text-gray-900">
                                            {new Date(employee.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Last Updated:</div>
                                        <div className="text-gray-900">
                                            {new Date(employee.updated_at).toLocaleString()}
                                        </div>
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
