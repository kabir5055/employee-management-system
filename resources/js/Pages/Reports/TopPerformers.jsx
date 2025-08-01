import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    TrophyIcon,
    UsersIcon,
    CurrencyDollarIcon,
    TruckIcon,
    StarIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function TopPerformers({ auth, topPerformers, period }) {
    const [selectedPeriod, setSelectedPeriod] = useState(period || 'all_time');

    const handlePeriodChange = (newPeriod) => {
        setSelectedPeriod(newPeriod);
        router.get('/reports/top-performers', {
            period: newPeriod,
        });
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const formatNumber = (number) => {
        return parseInt(number || 0).toLocaleString();
    };

    const periodOptions = [
        { value: 'all_time', label: 'All Time' },
        { value: 'this_month', label: 'This Month' },
        { value: 'this_year', label: 'This Year' },
        { value: 'last_year', label: 'Last Year' }
    ];

    const getMedalColor = (rank) => {
        switch (rank) {
            case 0: return 'text-yellow-500'; // Gold
            case 1: return 'text-gray-400'; // Silver
            case 2: return 'text-orange-600'; // Bronze
            default: return 'text-gray-300';
        }
    };

    const getRankBadge = (rank) => {
        switch (rank) {
            case 0: return 'bg-yellow-100 text-yellow-800';
            case 1: return 'bg-gray-100 text-gray-800';
            case 2: return 'bg-orange-100 text-orange-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/reports"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Reports
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Top Performers Report
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Identify highest performing employees
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <TrophyIcon className="h-8 w-8 text-gray-600" />
                    </div>
                </div>
            }
        >
            <Head title="Top Performers Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Period Filter */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Period</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {periodOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handlePeriodChange(option.value)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md border ${
                                        selectedPeriod === option.value
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Performance Summary */}
                    {topPerformers.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <UsersIcon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Top Performers
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {topPerformers.length}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Sales
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatCurrency(topPerformers.reduce((sum, performer) => sum + parseFloat(performer.total_sales || 0), 0))}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <TruckIcon className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Deliveries
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatNumber(topPerformers.reduce((sum, performer) => sum + parseInt(performer.total_deliveries || 0), 0))}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <ChartBarIcon className="h-8 w-8 text-indigo-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Avg Performance
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatCurrency(topPerformers.reduce((sum, performer) => sum + parseFloat(performer.total_sales || 0), 0) / topPerformers.length)}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top 3 Performers Podium */}
                    {topPerformers.length >= 3 && (
                        <div className="bg-white shadow rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">Performance Podium</h3>
                            <div className="flex justify-center items-end space-x-8">
                                {/* 2nd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-16 bg-gray-200 rounded-t-lg flex items-end justify-center pb-2">
                                        <span className="text-lg font-bold text-gray-600">2</span>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                            <StarIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h4 className="font-medium text-gray-900">{topPerformers[1]?.name}</h4>
                                        <p className="text-sm text-gray-600">{formatCurrency(topPerformers[1]?.total_sales)}</p>
                                    </div>
                                </div>

                                {/* 1st Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-yellow-400 rounded-t-lg flex items-end justify-center pb-2">
                                        <span className="text-xl font-bold text-yellow-800">1</span>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                                            <TrophyIcon className="h-10 w-10 text-yellow-500" />
                                        </div>
                                        <h4 className="font-medium text-gray-900">{topPerformers[0]?.name}</h4>
                                        <p className="text-sm text-gray-600">{formatCurrency(topPerformers[0]?.total_sales)}</p>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-12 bg-orange-300 rounded-t-lg flex items-end justify-center pb-2">
                                        <span className="text-lg font-bold text-orange-800">3</span>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                                            <StarIcon className="h-8 w-8 text-orange-600" />
                                        </div>
                                        <h4 className="font-medium text-gray-900">{topPerformers[2]?.name}</h4>
                                        <p className="text-sm text-gray-600">{formatCurrency(topPerformers[2]?.total_sales)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Performers Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Top Performing Employees
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Detailed performance rankings and metrics
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Deliveries
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Sales
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Commission
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Commission Rate
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topPerformers.map((performer, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRankBadge(index)}`}>
                                                        #{index + 1}
                                                    </span>
                                                    {index < 3 && (
                                                        <TrophyIcon className={`ml-2 h-5 w-5 ${getMedalColor(index)}`} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-indigo-600">
                                                                {performer.name ? performer.name.charAt(0).toUpperCase() : 'N'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {performer.name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Rank #{index + 1}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatNumber(performer.total_deliveries)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(performer.total_sales)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                {formatCurrency(performer.total_commission)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {parseFloat(performer.commission_rate || 0).toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {topPerformers.length === 0 && (
                            <div className="text-center py-12">
                                <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No performance data</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No top performer data available for the selected period.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
