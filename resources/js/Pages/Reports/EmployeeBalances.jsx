import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    BanknotesIcon,
    UsersIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    DocumentTextIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function EmployeeBalances({
    auth,
    balances: initialBalances,
    monthlyHistory: initialMonthlyHistory,
    transactionDetails: initialTransactionDetails,
    employees,
    selectedEmployeeId,
    startDate,
    endDate,
    filters
}) {
    const formatDateForInput = (date) => {
        if (!date) return '';
        try {
            return new Date(date).toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const [searchEmployeeId, setSearchEmployeeId] = useState(selectedEmployeeId || '');
    const [searchStartDate, setSearchStartDate] = useState(formatDateForInput(startDate));
    const [searchEndDate, setSearchEndDate] = useState(formatDateForInput(endDate));
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [filterErrors, setFilterErrors] = useState({});
    const [filteredBalances, setFilteredBalances] = useState(initialBalances);
    const [monthlyHistory, setMonthlyHistory] = useState(initialMonthlyHistory || []);
    const [transactionDetails, setTransactionDetails] = useState(initialTransactionDetails || []);

    const validateDateRange = (start, end) => {
        const errors = {};

        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate > endDate) {
                errors.dateRange = 'Start date cannot be after end date';
            }

            // Check if date range is too large (more than 2 years)
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 730) {
                errors.dateRange = 'Date range cannot exceed 2 years';
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
            if (searchEmployeeId) params.append('employee_id', searchEmployeeId);
            if (searchStartDate) params.append('start_date', searchStartDate);
            if (searchEndDate) params.append('end_date', searchEndDate);

                // Use fetch to get data without page reload
                fetch(`/api/reports/employee-balances-data?${params.toString()}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Update the balances data without page reload
                            setFilteredBalances(data.data);
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
        setSearchEmployeeId('');
        setSearchStartDate('');
        setSearchEndDate('');
        setFilterErrors({});

        // Reset to initial data instead of fetching new data
        setFilteredBalances(initialBalances);
        setMonthlyHistory(initialMonthlyHistory || []);
        setTransactionDetails(initialTransactionDetails || []);

        // Reset to overview tab
        setActiveTab('overview');
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setFilterErrors({});

        if (tabId === 'monthly' && searchEmployeeId) {
            // Fetch monthly history for last 1 month
            fetchMonthlyHistory();
        } else if (tabId === 'transactions' && searchEmployeeId) {
            // Fetch transaction details
            fetchTransactionDetails();
        }
    };

    const fetchMonthlyHistory = () => {
        if (!searchEmployeeId) {
            setFilterErrors({ general: 'Please select an employee first' });
            return;
        }

        setIsLoading(true);

        // Set date range to last 1 month
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        const params = new URLSearchParams();
        params.append('employee_id', searchEmployeeId);
        params.append('start_date', startDate.toISOString().split('T')[0]);
        params.append('end_date', endDate.toISOString().split('T')[0]);

        fetch(`/api/reports/employee-balances-data?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMonthlyHistory(data.monthlyHistory || []);
                    setIsLoading(false);
                } else {
                    setFilterErrors({ general: data.error || 'An error occurred' });
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching monthly history:', error);
                setFilterErrors({ general: 'Network error occurred' });
                setIsLoading(false);
            });
    };

    const fetchTransactionDetails = () => {
        if (!searchEmployeeId) {
            setFilterErrors({ general: 'Please select an employee first' });
            return;
        }

        setIsLoading(true);

        const params = new URLSearchParams();
        params.append('employee_id', searchEmployeeId);
        if (searchStartDate) params.append('start_date', searchStartDate);
        if (searchEndDate) params.append('end_date', searchEndDate);

        fetch(`/api/reports/employee-balances-data?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setTransactionDetails(data.transactionDetails || []);
                    setIsLoading(false);
                } else {
                    setFilterErrors({ general: data.error || 'An error occurred' });
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching transaction details:', error);
                setFilterErrors({ general: 'Network error occurred' });
                setIsLoading(false);
            });
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const totalBalance = filteredBalances.reduce((sum, item) => sum + parseFloat(item.balance || 0), 0);
    const positiveBalances = filteredBalances.filter(item => parseFloat(item.balance) > 0);
    const negativeBalances = filteredBalances.filter(item => parseFloat(item.balance) < 0);

    const selectedEmployee = employees.find(emp => emp.id == selectedEmployeeId);
    const totalIncome = transactionDetails.filter(t => parseFloat(t.amount) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpenses = Math.abs(transactionDetails.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + parseFloat(t.amount), 0));

    const tabs = [
        { id: 'overview', name: 'Overview', icon: ChartBarIcon },
        { id: 'monthly', name: 'Monthly History', icon: CalendarIcon },
        { id: 'transactions', name: 'Transaction Details', icon: DocumentTextIcon }
    ];

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
                                Employee Balances Report
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Current balance status of all employees
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BanknotesIcon className="h-8 w-8 text-gray-600" />
                    </div>
                </div>
            }
        >
            <Head title="Employee Balances Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Employee & Date Filter */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Options</h3>

                        {/* Show general error */}
                        {filterErrors.general && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-800 text-sm">{filterErrors.general}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Employee <span className="text-gray-400">(optional)</span>
                                </label>
                                <select
                                    value={searchEmployeeId}
                                    onChange={(e) => setSearchEmployeeId(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    disabled={isLoading}
                                >
                                    <option value="">All Employees</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
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
                        {(searchEmployeeId || searchStartDate || searchEndDate) && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-blue-800 text-sm font-medium">Active Filters:</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {searchEmployeeId && (
                                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            Employee: {employees.find(e => e.id == searchEmployeeId)?.name || 'Selected'}
                                        </span>
                                    )}
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
                                        <UsersIcon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {selectedEmployeeId ? 'Selected Employee' : 'Total Employees'}
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {selectedEmployeeId ? selectedEmployee?.name : filteredBalances.length}
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
                                        <BanknotesIcon className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {selectedEmployeeId ? 'Current Balance' : 'Total Balance'}
                                            </dt>
                                            <dd className={`text-lg font-medium ${
                                                selectedEmployeeId
                                                    ? parseFloat(balances.find(b => b.employee_id == selectedEmployeeId)?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                                    : totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {selectedEmployeeId
                                                    ? formatCurrency(balances.find(b => b.employee_id == selectedEmployeeId)?.balance || 0)
                                                    : formatCurrency(totalBalance)
                                                }
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
                                        <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {selectedEmployeeId ? 'Total Income' : 'Positive Balances'}
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {selectedEmployeeId ? formatCurrency(totalIncome) : positiveBalances.length}
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
                                        <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {selectedEmployeeId ? 'Total Expenses' : 'Negative Balances'}
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {selectedEmployeeId ? formatCurrency(totalExpenses) : negativeBalances.length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <tab.icon className="h-5 w-5 mr-2" />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Employee Balance Overview
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Employee Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Current Balance
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Last Updated
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredBalances.map((employee, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            {employee.employee_name ? employee.employee_name.charAt(0).toUpperCase() : 'N'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {employee.employee_name || 'N/A'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className={`text-sm font-medium ${
                                                                parseFloat(employee.balance) >= 0
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }`}>
                                                                {formatCurrency(employee.balance)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                parseFloat(employee.balance) > 0
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : parseFloat(employee.balance) < 0
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {parseFloat(employee.balance) > 0
                                                                    ? 'Credit'
                                                                    : parseFloat(employee.balance) < 0
                                                                    ? 'Debit'
                                                                    : 'Zero'
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {employee.last_updated ? formatDate(employee.last_updated) : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => {
                                                                    setSearchEmployeeId(employee.employee_id);
                                                                    handleSearch();
                                                                }}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'monthly' && (
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Monthly Balance History
                                        {selectedEmployee && (
                                            <span className="text-base font-normal text-gray-600 ml-2">
                                                - {selectedEmployee.name}
                                            </span>
                                        )}
                                    </h3>
                                    {monthlyHistory.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Month/Year
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Average Balance
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Minimum Balance
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Maximum Balance
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Transactions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {monthlyHistory.map((month, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {month.month_name} {month.year}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatCurrency(month.avg_balance)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                                {formatCurrency(month.min_balance)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                                {formatCurrency(month.max_balance)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {month.transaction_count} transactions
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No monthly data</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {selectedEmployeeId ? 'Select an employee to view monthly history.' : 'No monthly history available.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'transactions' && (
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Transaction Details
                                        {selectedEmployee && (
                                            <span className="text-base font-normal text-gray-600 ml-2">
                                                - {selectedEmployee.name}
                                            </span>
                                        )}
                                    </h3>
                                    {isLoading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
                                            <p className="mt-2 text-gray-500">Loading transaction details...</p>
                                        </div>
                                    ) : transactionDetails.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Description
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Amount
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Category
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {transactionDetails.map((transaction, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatDate(transaction.date)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    transaction.type === 'delivery'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                    {transaction.type === 'delivery' ? 'Product Delivery' : 'Balance Update'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {transaction.description}
                                                                {transaction.total_sale && (
                                                                    <div className="text-xs text-gray-500">
                                                                        Total Sale: {formatCurrency(transaction.total_sale)}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`text-sm font-medium ${
                                                                    parseFloat(transaction.amount) >= 0
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }`}>
                                                                    {parseFloat(transaction.amount) >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {transaction.category}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No transaction data</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {selectedEmployeeId ? 'No transactions found for the selected period.' : 'Select an employee to view transaction details.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!selectedEmployeeId && activeTab !== 'overview' && (
                            <div className="text-center py-12 bg-gray-50">
                                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Select an Employee</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Please select an employee from the filter above to view detailed information.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
