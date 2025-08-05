import React from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    IdentificationIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const DataField = ({
    icon: Icon,
    label,
    value,
    formatter,
    className = '',
    iconClassName = 'h-5 w-5 text-gray-400 mr-3'
}) => {
    if (!value && value !== 0) return null;

    const displayValue = formatter ? formatter(value) : value;

    return (
        <div className={`flex items-center ${className}`}>
            {Icon && <Icon className={iconClassName} />}
            <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">{displayValue}</p>
            </div>
        </div>
    );
};

const UserDataFields = ({ user, layout = 'vertical' }) => {
    // Dynamic field configuration
    const fieldConfigs = [
        {
            key: 'employee_id',
            icon: IdentificationIcon,
            label: 'Employee ID',
            value: user.employee_id,
            condition: user.employee_id
        },
        {
            key: 'phone',
            icon: PhoneIcon,
            label: 'Phone',
            value: user.phone,
            condition: user.phone
        },
        {
            key: 'email',
            icon: EnvelopeIcon,
            label: 'Email',
            value: user.email,
            condition: true // Always show email
        },
        {
            key: 'address',
            icon: MapPinIcon,
            label: 'Address',
            value: user.address,
            condition: user.address,
            iconClassName: 'h-5 w-5 text-gray-400 mr-3 mt-0.5'
        },
        {
            key: 'joining_date',
            icon: CalendarIcon,
            label: 'Joining Date',
            value: user.joining_date,
            condition: user.joining_date,
            formatter: (date) => new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },
        {
            key: 'date_of_birth',
            icon: CalendarIcon,
            label: 'Date of Birth',
            value: user.date_of_birth,
            condition: user.date_of_birth,
            formatter: (date) => new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },
        {
            key: 'salary',
            icon: CurrencyDollarIcon,
            label: 'Salary',
            value: user.salary || user.current_salary,
            condition: user.salary || user.current_salary,
            formatter: (amount) => `৳${parseFloat(amount).toLocaleString('en-BD')}`
        },
        {
            key: 'department',
            icon: BuildingOfficeIcon,
            label: 'Department',
            value: user.department?.name,
            condition: user.department
        },
        {
            key: 'position',
            icon: BriefcaseIcon,
            label: 'Position',
            value: user.position?.name,
            condition: user.position
        },
        {
            key: 'nid_number',
            icon: IdentificationIcon,
            label: 'NID Number',
            value: user.nid_number,
            condition: user.nid_number
        },
        {
            key: 'leaving_date',
            icon: ClockIcon,
            label: 'Leaving Date',
            value: user.leaving_date,
            condition: user.leaving_date && user.status === 'inactive',
            formatter: (date) => new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    ];

    // Filter fields based on conditions
    const visibleFields = fieldConfigs.filter(field => field.condition);

    const containerClass = layout === 'horizontal'
        ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
        : 'space-y-4';

    return (
        <div className={containerClass}>
            {visibleFields.map((field) => (
                <DataField
                    key={field.key}
                    icon={field.icon}
                    label={field.label}
                    value={field.value}
                    formatter={field.formatter}
                    iconClassName={field.iconClassName}
                />
            ))}
        </div>
    );
};

export default UserDataFields;
