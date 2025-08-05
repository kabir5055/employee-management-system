import React from 'react';
import {
    CheckBadgeIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const StatusBadge = ({
    status,
    type = 'user', // 'user', 'employee', 'order', 'payment', etc.
    size = 'sm',
    showIcon = true,
    customColors = {}
}) => {
    const sizeClasses = {
        'xs': 'px-2 py-0.5 text-xs',
        'sm': 'px-2.5 py-0.5 text-xs',
        'md': 'px-3 py-1 text-sm',
        'lg': 'px-4 py-1.5 text-base'
    };

    const iconSizes = {
        'xs': 'w-2.5 h-2.5',
        'sm': 'w-3 h-3',
        'md': 'w-4 h-4',
        'lg': 'w-5 h-5'
    };

    // Default status configurations
    const statusConfigs = {
        user: {
            active: {
                label: 'Active',
                colors: 'bg-green-100 text-green-800',
                icon: CheckBadgeIcon
            },
            inactive: {
                label: 'Inactive',
                colors: 'bg-red-100 text-red-800',
                icon: XCircleIcon
            },
            pending: {
                label: 'Pending',
                colors: 'bg-yellow-100 text-yellow-800',
                icon: ClockIcon
            },
            suspended: {
                label: 'Suspended',
                colors: 'bg-orange-100 text-orange-800',
                icon: ExclamationTriangleIcon
            }
        },
        employee: {
            active: {
                label: 'Active',
                colors: 'bg-green-100 text-green-800',
                icon: CheckBadgeIcon
            },
            inactive: {
                label: 'Inactive',
                colors: 'bg-red-100 text-red-800',
                icon: XCircleIcon
            },
            on_leave: {
                label: 'On Leave',
                colors: 'bg-blue-100 text-blue-800',
                icon: ClockIcon
            },
            terminated: {
                label: 'Terminated',
                colors: 'bg-gray-100 text-gray-800',
                icon: XCircleIcon
            }
        },
        order: {
            pending: {
                label: 'Pending',
                colors: 'bg-yellow-100 text-yellow-800',
                icon: ClockIcon
            },
            processing: {
                label: 'Processing',
                colors: 'bg-blue-100 text-blue-800',
                icon: ClockIcon
            },
            completed: {
                label: 'Completed',
                colors: 'bg-green-100 text-green-800',
                icon: CheckBadgeIcon
            },
            cancelled: {
                label: 'Cancelled',
                colors: 'bg-red-100 text-red-800',
                icon: XCircleIcon
            }
        },
        payment: {
            paid: {
                label: 'Paid',
                colors: 'bg-green-100 text-green-800',
                icon: CheckBadgeIcon
            },
            pending: {
                label: 'Pending',
                colors: 'bg-yellow-100 text-yellow-800',
                icon: ClockIcon
            },
            failed: {
                label: 'Failed',
                colors: 'bg-red-100 text-red-800',
                icon: XCircleIcon
            },
            refunded: {
                label: 'Refunded',
                colors: 'bg-gray-100 text-gray-800',
                icon: ExclamationTriangleIcon
            }
        }
    };

    // Get configuration for current status
    const config = statusConfigs[type]?.[status] || {
        label: status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown',
        colors: 'bg-gray-100 text-gray-800',
        icon: UserIcon
    };

    // Override with custom colors if provided
    const colors = customColors[status] || config.colors;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium ${colors}`}>
            {showIcon && Icon && (
                <Icon className={`${iconSizes[size]} mr-1`} />
            )}
            {config.label}
        </span>
    );
};

// Role Badge Component
export const RoleBadge = ({ role, size = 'sm' }) => {
    const roleConfigs = {
        super_admin: {
            label: 'Super Admin',
            colors: 'bg-purple-100 text-purple-800'
        },
        admin: {
            label: 'Admin',
            colors: 'bg-indigo-100 text-indigo-800'
        },
        hr: {
            label: 'HR',
            colors: 'bg-blue-100 text-blue-800'
        },
        employee: {
            label: 'Employee',
            colors: 'bg-gray-100 text-gray-800'
        },
        manager: {
            label: 'Manager',
            colors: 'bg-green-100 text-green-800'
        }
    };

    const sizeClasses = {
        'xs': 'px-2 py-0.5 text-xs',
        'sm': 'px-2.5 py-0.5 text-xs',
        'md': 'px-3 py-1 text-sm'
    };

    const config = roleConfigs[role] || {
        label: role?.charAt(0).toUpperCase() + role?.slice(1) || 'Unknown',
        colors: 'bg-gray-100 text-gray-800'
    };

    return (
        <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium ${config.colors}`}>
            <ShieldCheckIcon className="w-3 h-3 mr-1" />
            {config.label}
        </span>
    );
};

export default StatusBadge;
