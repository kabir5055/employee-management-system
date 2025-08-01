import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    TruckIcon,
    UsersIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function YearlyComparison({ auth, yearlyData }) {
    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const formatNumber = (number) => {
        return parseInt(number || 0).toLocaleString();
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
                                Yearly Comparison Report
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Compare yearly sales and performance trends
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-8 w-8 text-gray-600" />
                    </div>
                </div>
            }
        >
            <Head title="Yearly Comparison Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    {yearlyData.length > 0 && (
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
                                                    Years Analyzed
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {yearlyData.length}
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
                                                    Total Sales (All Years)
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatCurrency(yearlyData.reduce((sum, year) => sum + parseFloat(year.total_sales || 0), 0))}
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
                                                    {formatNumber(yearlyData.reduce((sum, year) => sum + parseInt(year.total_deliveries || 0), 0))}
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
                                                    Avg Commission
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatCurrency(yearlyData.reduce((sum, year) => sum + parseFloat(year.total_commission || 0), 0) / yearlyData.length)}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Yearly Comparison Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Year-over-Year Performance
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Detailed yearly comparison of sales performance and metrics
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Year
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Sales
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Commission
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Deliveries
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Active Employees
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Avg Per Employee
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {yearlyData.map((year, index) => {
                                        const avgPerEmployee = parseInt(year.active_employees) > 0
                                            ? parseFloat(year.total_sales) / parseInt(year.active_employees)
                                            : 0;

                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-blue-600">
                                                                    {year.year}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                Year {year.year}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(year.total_sales)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                    {formatCurrency(year.total_commission)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatNumber(year.total_deliveries)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatNumber(year.active_employees)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                        {formatCurrency(avgPerEmployee)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {yearlyData.length === 0 && (
                            <div className="text-center py-12">
                                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No yearly data</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No yearly comparison data is available.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Growth Analysis */}
                    {yearlyData.length > 1 && (
                        <div className="mt-8 bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Growth Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {yearlyData.slice(0, -1).map((currentYear, index) => {
                                    const nextYear = yearlyData[index + 1];
                                    const salesGrowth = parseFloat(currentYear.total_sales) > 0
                                        ? ((parseFloat(nextYear.total_sales) - parseFloat(currentYear.total_sales)) / parseFloat(currentYear.total_sales)) * 100
                                        : 0;
                                    const deliveryGrowth = parseInt(currentYear.total_deliveries) > 0
                                        ? ((parseInt(nextYear.total_deliveries) - parseInt(currentYear.total_deliveries)) / parseInt(currentYear.total_deliveries)) * 100
                                        : 0;

                                    return (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 mb-2">
                                                {currentYear.year} → {nextYear.year}
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Sales Growth:</span>
                                                    <span className={`text-sm font-medium ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Delivery Growth:</span>
                                                    <span className={`text-sm font-medium ${deliveryGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {deliveryGrowth >= 0 ? '+' : ''}{deliveryGrowth.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
