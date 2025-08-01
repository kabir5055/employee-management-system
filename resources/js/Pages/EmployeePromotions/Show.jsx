import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    TrophyIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    UserIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, promotion, allPromotions, employee }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this promotion record?')) {
            router.delete(route('employee-promotions.destroy', { employee_promotion: promotion.id }));
        }
    };

    const formatSalary = (amount) => {
        return amount ? `৳${parseFloat(amount).toLocaleString()}` : 'Not specified';
    };

    const calculateSalaryIncrease = () => {
        if (!promotion.new_salary || !promotion.previous_salary) {
            return 'Not available';
        }
        const previousSalary = parseFloat(promotion.previous_salary);
        const newSalary = parseFloat(promotion.new_salary);

        if (isNaN(previousSalary) || isNaN(newSalary)) {
            return 'Invalid salary data';
        }

        const increase = newSalary - previousSalary;
        const sign = increase >= 0 ? '+' : '';
        return `${sign}৳${increase.toLocaleString()}`;
    };

    const calculatePercentageIncrease = () => {
        if (!promotion.new_salary || !promotion.previous_salary) {
            return 'Not available';
        }

        const previousSalary = parseFloat(promotion.previous_salary);
        const newSalary = parseFloat(promotion.new_salary);

        if (isNaN(previousSalary) || isNaN(newSalary) || previousSalary <= 0) {
            return 'Invalid salary data';
        }

        const percentage = ((newSalary - previousSalary) / previousSalary) * 100;
        const sign = percentage >= 0 ? '+' : '';
        return `${sign}${percentage.toFixed(2)}%`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link
                            href={route('employee-promotions.index')}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center">
                            <TrophyIcon className="w-6 h-6 mr-2" />
                            Promotion History - {employee?.name || promotion.user?.name}
                        </h2>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={route('employee-promotions.edit', { employee_promotion: promotion.id })}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Promotion Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Employee Information */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <UserIcon className="w-5 h-5 mr-2" />
                                    Employee Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{promotion.user?.name || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{promotion.user?.employee_id || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{promotion.user?.email || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Current Department</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{promotion.user?.department?.name || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Current Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <div className="text-sm text-gray-900">
                                                {promotion.user?.position?.name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Level: {promotion.user?.position?.level || 'N/A'}
                                            </div>
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promotion Information */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                                    Promotion Details
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">From Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <div className="text-sm text-gray-900">
                                                {promotion.previous_position?.name || promotion.previousPosition?.name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Level: {promotion.previous_position?.level || promotion.previousPosition?.level || 'N/A'}
                                            </div>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">To Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <ArrowTrendingUpIcon className="w-4 h-4 mr-1 text-green-500" />
                                                {promotion.user?.position?.name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Level: {promotion.user?.position?.level || 'N/A'}
                                            </div>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">From Department</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {promotion.previous_department?.name || promotion.previousDepartment?.name || 'N/A'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">To Department</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {promotion.user?.department?.name || 'N/A'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Effective Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                            <CalendarIcon className="w-4 h-4 mr-1" />
                                            {promotion.effective_date ?
                                                new Date(promotion.effective_date).toLocaleDateString() :
                                                'N/A'
                                            }
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Promotion Type</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                promotion.promotion_type === 'promotion' ? 'bg-green-100 text-green-800' :
                                                promotion.promotion_type === 'demotion' ? 'bg-red-100 text-red-800' :
                                                promotion.promotion_type === 'transfer' ? 'bg-blue-100 text-blue-800' :
                                                promotion.promotion_type === 'salary_change' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {promotion.promotion_type ?
                                                    promotion.promotion_type.charAt(0).toUpperCase() + promotion.promotion_type.slice(1).replace('_', ' ') :
                                                    'N/A'
                                                }
                                            </span>
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Salary Information */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                                    Salary Changes
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Previous Salary</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {formatSalary(promotion.previous_salary)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">New Salary</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {formatSalary(promotion.new_salary)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Salary Change</dt>
                                        <dd className={`mt-1 text-sm font-medium ${
                                            promotion.new_salary && promotion.previous_salary &&
                                            parseFloat(promotion.new_salary) > parseFloat(promotion.previous_salary)
                                                ? 'text-green-600'
                                                : promotion.new_salary && promotion.previous_salary &&
                                                  parseFloat(promotion.new_salary) < parseFloat(promotion.previous_salary)
                                                ? 'text-red-600'
                                                : 'text-gray-600'
                                        }`}>
                                            {calculateSalaryIncrease()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Percentage Change</dt>
                                        <dd className={`mt-1 text-sm font-medium ${
                                            promotion.new_salary && promotion.previous_salary &&
                                            parseFloat(promotion.new_salary) > parseFloat(promotion.previous_salary)
                                                ? 'text-green-600'
                                                : promotion.new_salary && promotion.previous_salary &&
                                                  parseFloat(promotion.new_salary) < parseFloat(promotion.previous_salary)
                                                ? 'text-red-600'
                                                : 'text-gray-600'
                                        }`}>
                                            {calculatePercentageIncrease()}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Reason for Promotion</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{promotion.reason || 'No reason specified'}</dd>
                                    </div>
                                    {promotion.notes && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{promotion.notes}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {promotion.created_at ?
                                                new Date(promotion.created_at).toLocaleDateString() :
                                                'N/A'
                                            }
                                        </dd>
                                    </div>
                                    {promotion.approvedBy && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Approved By</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{promotion.approvedBy.name}</dd>
                                        </div>
                                    )}
                                    {promotion.approved_at && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Approved At</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(promotion.approved_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promotion History Timeline */}
                <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <TrophyIcon className="w-5 h-5 mr-2" />
                                Complete Promotion History ({allPromotions?.length || 0} records)
                            </h3>
                        </div>
                        <div className="p-6">
                            {allPromotions && allPromotions.length > 0 ? (
                                <div className="space-y-6">
                                    {allPromotions.map((promo, index) => (
                                        <div
                                            key={promo.id}
                                            className={`relative border-l-4 pl-6 pb-6 ${
                                                promo.id === promotion.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            {/* Timeline dot */}
                                            <div className={`absolute -left-2 w-4 h-4 rounded-full ${
                                                promo.id === promotion.id
                                                    ? 'bg-blue-500'
                                                    : 'bg-gray-300'
                                            }`}></div>

                                            {/* Current promotion indicator */}
                                            {promo.id === promotion.id && (
                                                <div className="mb-2">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Currently Viewing
                                                    </span>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Date and Type */}
                                                <div>
                                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                                        <CalendarIcon className="w-4 h-4 mr-1" />
                                                        {promo.effective_date ?
                                                            new Date(promo.effective_date).toLocaleDateString() :
                                                            'N/A'
                                                        }
                                                    </div>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        promo.promotion_type === 'promotion' ? 'bg-green-100 text-green-800' :
                                                        promo.promotion_type === 'demotion' ? 'bg-red-100 text-red-800' :
                                                        promo.promotion_type === 'transfer' ? 'bg-blue-100 text-blue-800' :
                                                        promo.promotion_type === 'salary_change' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {promo.promotion_type ?
                                                            promo.promotion_type.charAt(0).toUpperCase() + promo.promotion_type.slice(1).replace('_', ' ') :
                                                            'N/A'
                                                        }
                                                    </span>
                                                </div>

                                                {/* Position Changes */}
                                                <div>
                                                    <div className="text-sm">
                                                        <div className="text-gray-500">Position:</div>
                                                        <div className="font-medium text-gray-900">
                                                            {promo.previous_position?.name || promo.previousPosition?.name || 'N/A'}
                                                            <ArrowTrendingUpIcon className="w-4 h-4 inline mx-2 text-green-500" />
                                                            {promo.new_position?.name || promo.newPosition?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            Level: {promo.previous_position?.level || promo.previousPosition?.level || 'N/A'} → Level: {promo.new_position?.level || promo.newPosition?.level || 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm mt-1">
                                                        <div className="text-gray-500">Department:</div>
                                                        <div className="text-gray-900">
                                                            {promo.previous_department?.name || promo.previousDepartment?.name || 'N/A'}
                                                            {((promo.new_department?.name || promo.newDepartment?.name) && (promo.new_department?.name || promo.newDepartment?.name) !== (promo.previous_department?.name || promo.previousDepartment?.name)) && (
                                                                <span> → {promo.new_department?.name || promo.newDepartment?.name}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Salary Changes */}
                                                <div>
                                                    <div className="text-sm">
                                                        <div className="text-gray-500">Salary Change:</div>
                                                        <div className="font-medium">
                                                            {formatSalary(promo.previous_salary)}
                                                            <ArrowTrendingUpIcon className="w-4 h-4 inline mx-2 text-green-500" />
                                                            {formatSalary(promo.new_salary)}
                                                        </div>
                                                        {promo.previous_salary && promo.new_salary && (
                                                            <div className={`text-sm ${
                                                                parseFloat(promo.new_salary) > parseFloat(promo.previous_salary)
                                                                    ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                                {((parseFloat(promo.new_salary) - parseFloat(promo.previous_salary)) >= 0 ? '+' : '')}
                                                                ৳{(parseFloat(promo.new_salary) - parseFloat(promo.previous_salary)).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reason */}
                                            {promo.reason && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <strong>Reason:</strong> {promo.reason}
                                                </div>
                                            )}

                                            {/* Action buttons for current promotion */}
                                            {promo.id === promotion.id && (
                                                <div className="mt-3 flex space-x-2">
                                                    <Link
                                                        href={route('employee-promotions.edit', { employee_promotion: promo.id })}
                                                        className="inline-flex items-center px-3 py-1 bg-indigo-600 border border-transparent rounded text-xs text-white hover:bg-indigo-700"
                                                    >
                                                        <PencilIcon className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No promotion history found for this employee.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
