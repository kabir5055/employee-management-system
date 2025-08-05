import React from 'react';
import {
    CalendarDaysIcon,
    ClockIcon,
    ShieldCheckIcon,
    CheckBadgeIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AccountInfoField = ({
    label,
    value,
    formatter,
    className = '',
    valueClassName = 'text-sm text-gray-600'
}) => {
    if (!value && value !== 0 && value !== false) return null;

    const displayValue = formatter ? formatter(value) : value;

    return (
        <div className={className}>
            <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
            <p className={valueClassName}>{displayValue}</p>
        </div>
    );
};

const AccountInformation = ({ user }) => {
    // Dynamic account information configuration
    const accountFields = [
        {
            key: 'created_at',
            label: 'Account Created',
            value: user.created_at,
            formatter: (date) => new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            condition: user.created_at
        },
        {
            key: 'updated_at',
            label: 'Last Updated',
            value: user.updated_at,
            formatter: (date) => {
                const updatedDate = new Date(date);
                const now = new Date();
                const diffInDays = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));

                if (diffInDays === 0) {
                    return 'Today';
                } else if (diffInDays === 1) {
                    return 'Yesterday';
                } else if (diffInDays < 7) {
                    return `${diffInDays} days ago`;
                } else {
                    return updatedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            },
            condition: user.updated_at
        },
        {
            key: 'email_verified_at',
            label: 'Email Verified',
            value: user.email_verified_at,
            formatter: (date) => date ?
                new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) : 'Not verified',
            valueClassName: user.email_verified_at ?
                'text-sm text-green-600 font-medium' :
                'text-sm text-red-600 font-medium',
            condition: true // Always show
        },
        {
            key: 'account_status',
            label: 'Account Status',
            value: user.status,
            formatter: (status) => {
                const statusMap = {
                    active: 'Active',
                    inactive: 'Inactive',
                    suspended: 'Suspended',
                    pending: 'Pending'
                };
                return statusMap[status] || status?.charAt(0).toUpperCase() + status?.slice(1);
            },
            valueClassName: `text-sm font-medium ${
                user.status === 'active' ? 'text-green-600' :
                user.status === 'inactive' ? 'text-red-600' :
                user.status === 'suspended' ? 'text-orange-600' :
                'text-yellow-600'
            }`,
            condition: user.status
        },
        {
            key: 'last_login',
            label: 'Last Login',
            value: user.last_login_at,
            formatter: (date) => {
                if (!date) return 'Never logged in';

                const loginDate = new Date(date);
                const now = new Date();
                const diffInMinutes = Math.floor((now - loginDate) / (1000 * 60));
                const diffInHours = Math.floor(diffInMinutes / 60);
                const diffInDays = Math.floor(diffInHours / 24);

                if (diffInMinutes < 60) {
                    return `${diffInMinutes} minutes ago`;
                } else if (diffInHours < 24) {
                    return `${diffInHours} hours ago`;
                } else if (diffInDays < 7) {
                    return `${diffInDays} days ago`;
                } else {
                    return loginDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            },
            condition: true // Always show
        },
        {
            key: 'employment_status',
            label: 'Employment Status',
            value: user.employment_status,
            formatter: (status) => {
                const statusMap = {
                    active: 'Active Employee',
                    terminated: 'Terminated',
                    resigned: 'Resigned',
                    on_leave: 'On Leave',
                    probation: 'On Probation'
                };
                return statusMap[status] || status?.charAt(0).toUpperCase() + status?.slice(1);
            },
            valueClassName: `text-sm font-medium ${
                user.employment_status === 'active' ? 'text-green-600' :
                user.employment_status === 'terminated' ? 'text-red-600' :
                user.employment_status === 'resigned' ? 'text-gray-600' :
                user.employment_status === 'on_leave' ? 'text-blue-600' :
                'text-yellow-600'
            }`,
            condition: user.employment_status
        },
        {
            key: 'leaving_date',
            label: 'Leaving Date',
            value: user.leaving_date,
            formatter: (date) => new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            valueClassName: 'text-sm text-red-600 font-medium',
            condition: user.leaving_date && user.status === 'inactive'
        },
        {
            key: 'role_type',
            label: 'Role Type',
            value: user.is_super_admin ? 'super_admin' : (user.role || 'employee'),
            formatter: (role) => {
                const roleMap = {
                    super_admin: 'Super Administrator',
                    admin: 'Administrator',
                    hr: 'Human Resources',
                    manager: 'Manager',
                    employee: 'Employee'
                };
                return roleMap[role] || role?.charAt(0).toUpperCase() + role?.slice(1);
            },
            valueClassName: `text-sm font-medium ${
                user.is_super_admin ? 'text-purple-600' :
                user.role === 'admin' ? 'text-indigo-600' :
                user.role === 'hr' ? 'text-blue-600' :
                user.role === 'manager' ? 'text-green-600' :
                'text-gray-600'
            }`,
            condition: true // Always show
        }
    ];

    // Filter fields based on conditions
    const visibleFields = accountFields.filter(field => field.condition);

    // Calculate grid columns based on number of fields
    let gridCols = 'grid-cols-1';
    if (visibleFields.length >= 2) gridCols = 'md:grid-cols-2';

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                    <div className="flex items-center space-x-2">
                        {user.email_verified_at ? (
                            <CheckBadgeIcon className="w-5 h-5 text-green-500" title="Email Verified" />
                        ) : (
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" title="Email Not Verified" />
                        )}
                        {user.is_super_admin && (
                            <ShieldCheckIcon className="w-5 h-5 text-purple-500" title="Super Administrator" />
                        )}
                    </div>
                </div>

                {visibleFields.length > 0 ? (
                    <div className={`grid ${gridCols} gap-6`}>
                        {visibleFields.map((field) => (
                            <AccountInfoField
                                key={field.key}
                                label={field.label}
                                value={field.value}
                                formatter={field.formatter}
                                valueClassName={field.valueClassName}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No account information available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Account information will appear here when available.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountInformation;
