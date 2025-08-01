import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    EyeIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    UserIcon,
    CurrencyDollarIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    TruckIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Index({ auth, employees, departments, positions, canViewAllEmployees, filters, summary }) {
    const [processing, setProcessing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, reset } = useForm({
        search: filters.search || '',
        department_id: filters.department_id || '',
        position_id: filters.position_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get('/balance-sheets');
    };

    const clearFilters = () => {
        reset();
        router.get('/balance-sheets');
    };

    const handleExport = (type) => {
        const params = new URLSearchParams(data);
        params.append('type', type);
        window.open(`/balance-sheets/export?${params.toString()}`);
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const calculateEmployeePosition = (employee) => {
        const currentBalance = employee.balance_sheets?.[0]?.current_balance || 0;
        const pendingDeliveries = employee.product_deliveries?.filter(d => d.payment_status === 'pending')
            .reduce((sum, delivery) => sum + parseFloat(delivery.total_amount || 0), 0) || 0;
        const productsInHand = employee.employee_stocks?.reduce((sum, stock) =>
            sum + (parseFloat(stock.quantity || 0) * parseFloat(stock.product?.price || 0)), 0) || 0;

        return {
            currentBalance,
            marketDues: pendingDeliveries,
            productsInHand,
            netPosition: currentBalance + productsInHand - pendingDeliveries
        };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Employee Balance Positions
                    </h2>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 bg-white/80 text-gray-700 text-sm font-medium rounded-xl border border-white/50 hover:bg-white hover:shadow-md transition-all duration-200"
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleExport('xlsx')}
                                className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                Excel
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                CSV
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Employee Balance Positions" />

            <div className="space-y-6">
                {/* Filters */}
                {showFilters && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MagnifyingGlassIcon className="h-4 w-4 inline mr-1" />
                                    Search Employee
                                </label>
                                <input
                                    type="text"
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    placeholder="Name, ID, or email..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                                    Department
                                </label>
                                <select
                                    value={data.department_id}
                                    onChange={(e) => setData('department_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Departments</option>
                                    {departments?.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <BriefcaseIcon className="h-4 w-4 inline mr-1" />
                                    Position
                                </label>
                                <select
                                    value={data.position_id}
                                    onChange={(e) => setData('position_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Positions</option>
                                    {positions?.map((position) => (
                                        <option key={position.id} value={position.id}>
                                            {position.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                                >
                                    Filter
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Clear
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                                <UserIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">{summary?.total_employees || 0}</p>
                                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                                <CurrencyDollarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatCurrency(summary?.total_balance || 0)}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                                <TruckIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatCurrency(summary?.total_market_dues || 0)}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Market Dues</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                                <ShoppingBagIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatCurrency(summary?.total_products_in_hand || 0)}
                                </p>
                                <p className="text-sm font-medium text-gray-600">Products Value</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employee Balance Positions Table */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800">Employee Balance Positions</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Balance
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Market Dues
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Products in Hand
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Net Position
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/30 divide-y divide-gray-200">
                                {employees.data?.map((employee) => {
                                    const position = calculateEmployeePosition(employee);
                                    return (
                                        <tr key={employee.id} className="hover:bg-white/50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                                            <span className="text-white font-medium text-sm">
                                                                {employee.name?.charAt(0)?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {employee.employee_id}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {employee.department?.name} • {employee.position?.title}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-bold ${
                                                    position.currentBalance >= 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}>
                                                    {formatCurrency(position.currentBalance)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Account Balance
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-orange-600">
                                                    {formatCurrency(position.marketDues)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Pending Payments
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-blue-600">
                                                    {formatCurrency(position.productsInHand)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Stock Value
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-bold ${
                                                    position.netPosition >= 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}>
                                                    {formatCurrency(position.netPosition)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Net Position
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={`/balance-sheets/${employee.id}`}
                                                    className="inline-flex items-center p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {employees.links && (
                        <div className="px-6 py-4 border-t border-white/20">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {employees.from || 0} to {employees.to || 0} of {employees.total || 0} results
                                </div>
                                <div className="flex space-x-1">
                                    {employees.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                                link.active
                                                    ? 'bg-indigo-500 text-white'
                                                    : link.url
                                                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {employees.data?.length === 0 && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center">
                        <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
