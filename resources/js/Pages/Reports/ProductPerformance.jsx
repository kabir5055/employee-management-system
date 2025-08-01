import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CubeIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function ProductPerformance({ auth, performance: initialPerformance, startDate, endDate }) {
    const formatDateForInput = (date) => {
        if (!date) return '';
        try {
            return new Date(date).toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const [searchStartDate, setSearchStartDate] = useState(formatDateForInput(startDate));
    const [searchEndDate, setSearchEndDate] = useState(formatDateForInput(endDate));
    const [isLoading, setIsLoading] = useState(false);
    const [filterErrors, setFilterErrors] = useState({});
    const [filteredPerformance, setFilteredPerformance] = useState(initialPerformance);

    const validateDateRange = (start, end) => {
        const errors = {};

        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate > endDate) {
                errors.dateRange = 'Start date cannot be after end date';
            }

            // Check if date range is too large (more than 1 year)
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 365) {
                errors.dateRange = 'Date range cannot exceed 1 year for product performance';
            }
        }

        return errors;
    };

    const handleSearch = () => {
        try {
            setIsLoading(true);
            setFilterErrors({});

            // Validate date range
            const validationErrors = validateDateRange(searchStartDate, searchEndDate);
            if (Object.keys(validationErrors).length > 0) {
                setFilterErrors(validationErrors);
                setIsLoading(false);
                return;
            }

            // Build query parameters - only include non-empty values
            const params = new URLSearchParams();
            if (searchStartDate) params.append('start_date', searchStartDate);
            if (searchEndDate) params.append('end_date', searchEndDate);

            // Use fetch to get data without page reload
            fetch(`/api/reports/product-performance-data?${params.toString()}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setFilteredPerformance(data.data);
                        setIsLoading(false);
                    } else {
                        setFilterErrors({ general: data.error || 'An error occurred' });
                        setIsLoading(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setFilterErrors({ general: 'Network error occurred' });
                    setIsLoading(false);
                });

        } catch (error) {
            console.error('Error applying filter:', error);
            setFilterErrors({ general: 'An error occurred while applying the filter' });
            setIsLoading(false);
        }
    };    const clearFilters = () => {
        setSearchStartDate('');
        setSearchEndDate('');
        setFilterErrors({});

        // Reset to initial data instead of fetching new data
        setFilteredPerformance(initialPerformance);
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const totalProducts = filteredPerformance.length;
    const totalDeliveries = filteredPerformance.reduce((sum, item) => sum + parseInt(item.total_deliveries || 0), 0);
    const totalQuantity = filteredPerformance.reduce((sum, item) => sum + parseInt(item.total_quantity || 0), 0);
    const totalAmount = filteredPerformance.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);

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
                                Product Performance Report
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Track product sales and delivery statistics
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CubeIcon className="h-8 w-8 text-gray-600" />
                    </div>
                </div>
            }
        >
            <Head title="Product Performance Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Date Filter */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Date Range</h3>

                        {/* Show general error */}
                        {filterErrors.general && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-800 text-sm">{filterErrors.general}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="date"
                                    value={searchStartDate}
                                    onChange={(e) => setSearchStartDate(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="date"
                                    value={searchEndDate}
                                    onChange={(e) => setSearchEndDate(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            Apply Filter
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={clearFilters}
                                    disabled={isLoading}
                                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Show date range error */}
                        {filterErrors.dateRange && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-800 text-sm">{filterErrors.dateRange}</p>
                            </div>
                        )}

                        {/* Active filter indicators */}
                        {(searchStartDate || searchEndDate) && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-blue-800 text-sm font-medium">Active Filters:</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {searchStartDate && (
                                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            From: {searchStartDate}
                                        </span>
                                    )}
                                    {searchEndDate && (
                                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            To: {searchEndDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CubeIcon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Products
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {totalProducts}
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
                                        <ShoppingBagIcon className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Deliveries
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {totalDeliveries.toLocaleString()}
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
                                        <ChartBarIcon className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Quantity
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {totalQuantity.toLocaleString()}
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
                                        <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Sales
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(totalAmount)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Performance Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Product Performance Details
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Detailed performance statistics for each product
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Deliveries
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Commission
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Avg Commission Rate
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : filteredPerformance.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No product performance data found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPerformance.map((product, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                            <CubeIcon className="h-5 w-5 text-purple-600" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.product_name || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {parseInt(product.total_deliveries || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {parseInt(product.total_quantity || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(product.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                {formatCurrency(product.total_commission)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {parseFloat(product.average_commission_rate || 0).toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredPerformance.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No product data</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No product performance data available for the selected date range.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
