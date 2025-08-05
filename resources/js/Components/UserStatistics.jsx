import React from 'react';
import {
    CurrencyDollarIcon,
    TruckIcon,
    ShoppingBagIcon,
    BanknotesIcon,
    ClipboardDocumentListIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon
} from '@heroicons/react/24/outline';

const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'blue',
    formatter,
    trend,
    className = ''
}) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        pink: 'bg-pink-50 text-pink-600',
        gray: 'bg-gray-50 text-gray-600'
    };

    const textColorClasses = {
        blue: 'text-blue-700',
        green: 'text-green-700',
        yellow: 'text-yellow-700',
        red: 'text-red-700',
        purple: 'text-purple-700',
        indigo: 'text-indigo-700',
        pink: 'text-pink-700',
        gray: 'text-gray-700'
    };

    const displayValue = formatter ? formatter(value) : value;

    return (
        <div className={`${colorClasses[color]} rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className={`${textColorClasses[color]} text-2xl font-bold`}>
                            {displayValue}
                        </div>
                        {Icon && <Icon className="h-8 w-8" />}
                    </div>
                    <div className={`text-sm ${textColorClasses[color]} font-medium mt-1`}>
                        {title}
                    </div>
                    {trend && (
                        <div className="flex items-center mt-1">
                            {trend.direction === 'up' && <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />}
                            {trend.direction === 'down' && <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />}
                            {trend.direction === 'neutral' && <MinusIcon className="w-4 h-4 text-gray-500 mr-1" />}
                            <span className={`text-xs ${
                                trend.direction === 'up' ? 'text-green-600' :
                                trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                                {trend.value} {trend.label}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserStatistics = ({ stats, user }) => {
    // Dynamic statistics configuration
    const statisticsConfig = [
        {
            key: 'total_deliveries',
            title: 'Total Deliveries',
            value: stats.total_deliveries || 0,
            icon: TruckIcon,
            color: 'blue',
            condition: true
        },
        {
            key: 'total_sales',
            title: 'Total Sales',
            value: stats.total_sales || 0,
            icon: ShoppingBagIcon,
            color: 'green',
            formatter: (value) => `৳${value.toLocaleString('en-BD')}`,
            condition: true
        },
        {
            key: 'total_commission',
            title: 'Total Commission',
            value: stats.total_commission || 0,
            icon: BanknotesIcon,
            color: 'yellow',
            formatter: (value) => `৳${value.toLocaleString('en-BD')}`,
            condition: stats.total_commission > 0
        },
        {
            key: 'current_balance',
            title: 'Current Balance',
            value: stats.current_balance || 0,
            icon: CurrencyDollarIcon,
            color: stats.current_balance >= 0 ? 'green' : 'red',
            formatter: (value) => `৳${value.toLocaleString('en-BD')}`,
            condition: true
        },
        {
            key: 'total_expenses',
            title: 'Total Expenses',
            value: stats.total_expenses || 0,
            icon: ClipboardDocumentListIcon,
            color: 'red',
            formatter: (value) => `৳${value.toLocaleString('en-BD')}`,
            condition: stats.total_expenses > 0
        },
        {
            key: 'monthly_salary',
            title: 'Monthly Salary',
            value: user.salary || user.current_salary || 0,
            icon: BanknotesIcon,
            color: 'indigo',
            formatter: (value) => `৳${parseFloat(value).toLocaleString('en-BD')}`,
            condition: user.salary || user.current_salary
        }
    ];

    // Filter statistics based on conditions
    const visibleStats = statisticsConfig.filter(stat => stat.condition);

    // Calculate grid columns based on number of stats
    let gridCols = 'grid-cols-1';
    if (visibleStats.length >= 2) gridCols = 'md:grid-cols-2';
    if (visibleStats.length >= 3) gridCols = 'lg:grid-cols-3';
    if (visibleStats.length >= 4) gridCols = 'xl:grid-cols-4';

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Statistics</h3>

                {visibleStats.length > 0 ? (
                    <div className={`grid ${gridCols} gap-6`}>
                        {visibleStats.map((stat) => (
                            <StatCard
                                key={stat.key}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                color={stat.color}
                                formatter={stat.formatter}
                                trend={stat.trend}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No statistics available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Statistics will appear here once the user has activity.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserStatistics;
