import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    TruckIcon,
    UsersIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function MonthlyTrends({ auth, monthlyTrends }) {
    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const formatNumber = (number) => {
        return parseInt(number || 0).toLocaleString();
    };

    const currentYear = new Date().getFullYear();
    const currentYearData = monthlyTrends.filter(trend => trend.year === currentYear);
    const previousYearData = monthlyTrends.filter(trend => trend.year === currentYear - 1);

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
                                Monthly Trends Report
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Monitor monthly sales patterns and trends
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ArrowTrendingUpIcon className="h-8 w-8 text-gray-600" />
                    </div>
                </div>
            }
        >
            <Head title="Monthly Trends Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    {monthlyTrends.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <CalendarIcon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Months Analyzed
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {monthlyTrends.length}
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
                                                    {formatCurrency(monthlyTrends.reduce((sum, month) => sum + parseFloat(month.total_sales || 0), 0))}
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
                                                    {formatNumber(monthlyTrends.reduce((sum, month) => sum + parseInt(month.delivery_count || 0), 0))}
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
                                                    Avg Monthly Sales
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatCurrency(monthlyTrends.reduce((sum, month) => sum + parseFloat(month.total_sales || 0), 0) / monthlyTrends.length)}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Current Year vs Previous Year */}
                    {currentYearData.length > 0 && previousYearData.length > 0 && (
                        <div className="bg-white shadow rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {currentYear} vs {currentYear - 1} Comparison
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(currentYearData.reduce((sum, month) => sum + parseFloat(month.total_sales || 0), 0))}
                                    </div>
                                    <div className="text-sm text-gray-600">{currentYear} Sales</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-600">
                                        {formatCurrency(previousYearData.reduce((sum, month) => sum + parseFloat(month.total_sales || 0), 0))}
                                    </div>
                                    <div className="text-sm text-gray-600">{currentYear - 1} Sales</div>
                                </div>
                                <div className="text-center">
                                    {(() => {
                                        const currentTotal = currentYearData.reduce((sum, month) => sum + parseFloat(month.total_sales || 0), 0);
                                        const previousTotal = previousYearData.reduce((sum, month) => sum + parseFloat(month.total_sales || 0), 0);
                                        const growth = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
                                        return (
                                            <>
                                                <div className={`text-2xl font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                                </div>
                                                <div className="text-sm text-gray-600">Growth Rate</div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Monthly Trends Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Monthly Performance Trends
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Detailed monthly performance analysis and patterns
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Month/Year
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Sales
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Commission
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deliveries
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Active Employees
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Commission Rate
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlyTrends.map((trend, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-indigo-600">
                                                                {trend.month}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {trend.month_name} {trend.year}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Month {trend.month}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(trend.total_sales)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                {formatCurrency(trend.total_commission)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatNumber(trend.delivery_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatNumber(trend.total_quantity)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatNumber(trend.active_employees)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {parseFloat(trend.average_commission_rate || 0).toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {monthlyTrends.length === 0 && (
                            <div className="text-center py-12">
                                <ArrowTrendingUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No monthly data</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No monthly trend data is available.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
