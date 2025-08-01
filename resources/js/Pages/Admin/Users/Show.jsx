import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    CheckBadgeIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function Show({ user, stats }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.users.index')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                {user.name}
                            </h2>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>
                    <Link
                        href={route('admin.users.edit', { user: user.id })}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <PencilSquareIcon className="w-4 h-4 mr-2" />
                        Edit User
                    </Link>
                </div>
            }
        >
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="text-center">
                                        <div className="mx-auto h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                                            <UserIcon className="h-12 w-12 text-indigo-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>

                                        <div className="mt-4 flex items-center justify-center gap-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.is_active ? (
                                                    <>
                                                        <CheckBadgeIcon className="w-3 h-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircleIcon className="w-3 h-3 mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </span>

                                            {user.is_super_admin && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    Super Admin
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        {user.employee_id && (
                                            <div className="flex items-center">
                                                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Employee ID</p>
                                                    <p className="text-sm text-gray-600">{user.employee_id}</p>
                                                </div>
                                            </div>
                                        )}

                                        {user.phone && (
                                            <div className="flex items-center">
                                                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                                    <p className="text-sm text-gray-600">{user.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Email</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                        </div>

                                        {user.address && (
                                            <div className="flex items-start">
                                                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Address</p>
                                                    <p className="text-sm text-gray-600">{user.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {user.hire_date && (
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Hire Date</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(user.hire_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {user.salary && (
                                            <div className="flex items-center">
                                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Salary</p>
                                                    <p className="text-sm text-gray-600">
                                                        ${parseFloat(user.salary).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {user.department && (
                                            <div className="flex items-center">
                                                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Department</p>
                                                    <p className="text-sm text-gray-600">{user.department.name}</p>
                                                </div>
                                            </div>
                                        )}

                                        {user.position && (
                                            <div className="flex items-center">
                                                <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Position</p>
                                                    <p className="text-sm text-gray-600">{user.position.name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Statistics</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <div className="text-blue-600 text-2xl font-bold">
                                                {stats.total_deliveries || 0}
                                            </div>
                                            <div className="text-sm text-blue-700 font-medium">Total Deliveries</div>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4">
                                            <div className="text-green-600 text-2xl font-bold">
                                                ${(stats.total_sales || 0).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-green-700 font-medium">Total Sales</div>
                                        </div>

                                        <div className="bg-yellow-50 rounded-lg p-4">
                                            <div className="text-yellow-600 text-2xl font-bold">
                                                ${(stats.total_commission || 0).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-yellow-700 font-medium">Total Commission</div>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <div className="text-purple-600 text-2xl font-bold">
                                                ${(stats.current_balance || 0).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-purple-700 font-medium">Current Balance</div>
                                        </div>

                                        <div className="bg-red-50 rounded-lg p-4">
                                            <div className="text-red-600 text-2xl font-bold">
                                                ${(stats.total_expenses || 0).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-red-700 font-medium">Total Expenses</div>
                                        </div>

                                        <div className="bg-indigo-50 rounded-lg p-4">
                                            <div className="text-indigo-600 text-2xl font-bold">
                                                {stats.total_sales > 0 ?
                                                    `${((stats.total_commission / stats.total_sales) * 100).toFixed(1)}%` :
                                                    '0%'
                                                }
                                            </div>
                                            <div className="text-sm text-indigo-700 font-medium">Commission Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Account Created</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Last Updated</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(user.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Email Verified</p>
                                            <p className="text-sm text-gray-600">
                                                {user.email_verified_at ?
                                                    new Date(user.email_verified_at).toLocaleDateString() :
                                                    'Not verified'
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Account Status</p>
                                            <p className={`text-sm font-medium ${
                                                user.is_active ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </p>
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
