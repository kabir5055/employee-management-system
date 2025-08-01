import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    UserIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    TruckIcon,
    ShoppingBagIcon,
    BanknotesIcon,
    BuildingOfficeIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, employee, balanceSheet, financialSummary, productsInHand, recentDeliveries, recentExpenses, canEdit }) {

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount || 0).toLocaleString()}`;
    };

    const isPositiveBalance = parseFloat(financialSummary?.current_balance || 0) >= 0;
    const isPositiveNetPosition = parseFloat(financialSummary?.net_position || 0) >= 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/balance-sheets"
                            className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Back to Balance Positions
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                {employee?.name} - Financial Position
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Employee ID: {employee?.employee_id}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Balance Position - ${employee?.name || 'N/A'}`} />

            <div className="space-y-6">
                {/* Employee Info Card */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center space-x-6">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                            <UserIcon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {employee?.name || 'N/A'}
                            </h3>
                            <p className="text-gray-600">Employee ID: {employee?.employee_id || 'N/A'}</p>
                            {employee?.department && (
                                <div className="flex items-center text-gray-600 mt-1">
                                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                                    {employee.department.name}
                                </div>
                            )}
                            {employee?.position && (
                                <div className="flex items-center text-gray-600 mt-1">
                                    <BriefcaseIcon className="h-4 w-4 mr-1" />
                                    {employee.position.title}
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="flex items-center text-gray-500 mb-2">
                                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                                <span className="text-sm">Last Updated</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                                {balanceSheet?.updated_at ? formatDate(balanceSheet.updated_at) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Current Balance */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-xl shadow-lg ${
                                isPositiveBalance
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                    : 'bg-gradient-to-r from-red-500 to-pink-600'
                            }`}>
                                <CurrencyDollarIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">Account Balance</h3>
                        </div>
                        <p className={`text-3xl font-bold ${
                            isPositiveBalance ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {formatCurrency(financialSummary?.current_balance)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Current account balance
                        </p>
                    </div>

                    {/* Market Dues */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                                <TruckIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">Market Dues</h3>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">
                            {formatCurrency(financialSummary?.market_dues)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Pending delivery payments
                        </p>
                    </div>

                    {/* Products in Hand */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                                <ShoppingBagIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">Products Value</h3>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">
                            {formatCurrency(financialSummary?.products_in_hand_value)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Current stock value
                        </p>
                    </div>

                    {/* Net Position */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-xl shadow-lg ${
                                isPositiveNetPosition
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                    : 'bg-gradient-to-r from-red-500 to-pink-600'
                            }`}>
                                <BanknotesIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">Net Position</h3>
                        </div>
                        <p className={`text-3xl font-bold ${
                            isPositiveNetPosition ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {formatCurrency(financialSummary?.net_position)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Overall financial position
                        </p>
                    </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                            <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 ml-3">Financial Breakdown</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-4">Assets & Credits</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Account Balance:</span>
                                    <span className={`font-medium ${isPositiveBalance ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(financialSummary?.current_balance)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Products in Hand:</span>
                                    <span className="font-medium text-purple-600">
                                        {formatCurrency(financialSummary?.products_in_hand_value)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Total Deliveries:</span>
                                    <span className="font-medium text-blue-600">
                                        {formatCurrency(financialSummary?.total_deliveries)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-4">Liabilities & Dues</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Market Dues:</span>
                                    <span className="font-medium text-orange-600">
                                        {formatCurrency(financialSummary?.market_dues)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Total Expenses:</span>
                                    <span className="font-medium text-red-600">
                                        {formatCurrency(financialSummary?.total_expenses)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 pt-3">
                                    <span className="font-semibold text-gray-800">Net Position:</span>
                                    <span className={`font-bold text-lg ${
                                        isPositiveNetPosition ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {formatCurrency(financialSummary?.net_position)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products in Hand */}
                {productsInHand && productsInHand.length > 0 && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                                <ShoppingBagIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">Products in Hand</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {productsInHand.map((stock) => (
                                        <tr key={stock.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {stock.product?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stock.quantity || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(stock.product?.price || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                                                {formatCurrency((stock.quantity || 0) * (stock.product?.price || 0))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Deliveries */}
                    {recentDeliveries && recentDeliveries.length > 0 && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-center mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                                    <TruckIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 ml-3">Recent Deliveries</h3>
                            </div>
                            <div className="space-y-3">
                                {recentDeliveries.slice(0, 5).map((delivery) => (
                                    <div key={delivery.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {delivery.product?.name || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(delivery.delivery_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatCurrency(delivery.total_amount)}
                                            </p>
                                            <p className={`text-xs ${
                                                delivery.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
                                            }`}>
                                                {delivery.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Expenses */}
                    {recentExpenses && recentExpenses.length > 0 && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-center mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
                                    <DocumentTextIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 ml-3">Recent Expenses</h3>
                            </div>
                            <div className="space-y-3">
                                {recentExpenses.slice(0, 5).map((expense) => (
                                    <div key={expense.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {expense.description || 'Expense'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(expense.expense_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-red-600">
                                            {formatCurrency(expense.amount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/product-deliveries/create"
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            <TruckIcon className="h-4 w-4 mr-2" />
                            New Delivery
                        </Link>
                        <Link
                            href="/expenses/create"
                            className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                            <DocumentTextIcon className="h-4 w-4 mr-2" />
                            Add Expense
                        </Link>
                        <Link
                            href="/balance-sheets"
                            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                            <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                            All Balance Positions
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
