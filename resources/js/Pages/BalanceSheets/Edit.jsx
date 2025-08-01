import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon,
    UserIcon,
    MapPinIcon,
    DocumentTextIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

export default function Edit({ auth, balanceSheet, employees, canViewAllEmployees }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: balanceSheet.employee_id || '',
        date: balanceSheet.date || '',
        location: balanceSheet.location || '',
        product_delivery_amount: balanceSheet.product_delivery_amount || '',
        expense_amount: balanceSheet.expense_amount || '',
        total_amount: balanceSheet.total_amount || '',
        current_balance: balanceSheet.current_balance || '',
        notes: balanceSheet.notes || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/balance-sheets/${balanceSheet.id}`);
    };

    const calculateTotals = () => {
        const deliveryAmount = parseFloat(data.product_delivery_amount || 0);
        const expenseAmount = parseFloat(data.expense_amount || 0);
        const totalAmount = deliveryAmount - expenseAmount;

        setData({
            ...data,
            total_amount: totalAmount.toFixed(2),
            current_balance: totalAmount.toFixed(2)
        });
    };

    const handleDeliveryAmountChange = (value) => {
        setData('product_delivery_amount', value);
        // Auto-calculate if expense amount exists
        if (data.expense_amount) {
            const deliveryAmount = parseFloat(value || 0);
            const expenseAmount = parseFloat(data.expense_amount || 0);
            const totalAmount = deliveryAmount - expenseAmount;
            setData({
                ...data,
                product_delivery_amount: value,
                total_amount: totalAmount.toFixed(2),
                current_balance: totalAmount.toFixed(2)
            });
        }
    };

    const handleExpenseAmountChange = (value) => {
        setData('expense_amount', value);
        // Auto-calculate if delivery amount exists
        if (data.product_delivery_amount) {
            const deliveryAmount = parseFloat(data.product_delivery_amount || 0);
            const expenseAmount = parseFloat(value || 0);
            const totalAmount = deliveryAmount - expenseAmount;
            setData({
                ...data,
                expense_amount: value,
                total_amount: totalAmount.toFixed(2),
                current_balance: totalAmount.toFixed(2)
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/balance-sheets/${balanceSheet.id}`}
                            className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Back to Balance Sheet
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Edit Balance Sheet
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {balanceSheet.employee?.name} - {new Date(balanceSheet.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Balance Sheet - ${balanceSheet.employee?.name}`} />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                                <DocumentTextIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">Basic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Employee Selection */}
                            {canViewAllEmployees ? (
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        Employee *
                                    </label>
                                    <select
                                        value={data.employee_id}
                                        onChange={(e) => setData('employee_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name} ({employee.employee_id})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.employee_id && (
                                        <p className="mt-2 text-sm text-red-600">{errors.employee_id}</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        Employee
                                    </label>
                                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600">
                                        {balanceSheet.employee?.name || 'Current Employee'}
                                    </div>
                                </div>
                            )}

                            {/* Date */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                                {errors.date && (
                                    <p className="mt-2 text-sm text-red-600">{errors.date}</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mt-6">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <MapPinIcon className="h-4 w-4 mr-2" />
                                Location
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="Enter location (optional)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                            {errors.location && (
                                <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                            )}
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                                    <CurrencyDollarIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 ml-3">Financial Details</h3>
                            </div>
                            <button
                                type="button"
                                onClick={calculateTotals}
                                className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                            >
                                Recalculate Totals
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Delivery Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Delivery Amount *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                                    <input
                                        type="number"
                                        value={data.product_delivery_amount}
                                        onChange={(e) => handleDeliveryAmountChange(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                                {errors.product_delivery_amount && (
                                    <p className="mt-2 text-sm text-red-600">{errors.product_delivery_amount}</p>
                                )}
                            </div>

                            {/* Expense Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expense Amount *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                                    <input
                                        type="number"
                                        value={data.expense_amount}
                                        onChange={(e) => handleExpenseAmountChange(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                                {errors.expense_amount && (
                                    <p className="mt-2 text-sm text-red-600">{errors.expense_amount}</p>
                                )}
                            </div>

                            {/* Total Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                                    <input
                                        type="number"
                                        value={data.total_amount}
                                        onChange={(e) => setData('total_amount', e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                {errors.total_amount && (
                                    <p className="mt-2 text-sm text-red-600">{errors.total_amount}</p>
                                )}
                            </div>

                            {/* Current Balance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Balance
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                                    <input
                                        type="number"
                                        value={data.current_balance}
                                        onChange={(e) => setData('current_balance', e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        className={`w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                            parseFloat(data.current_balance || 0) >= 0
                                                ? 'text-green-600 font-semibold'
                                                : 'text-red-600 font-semibold'
                                        }`}
                                    />
                                </div>
                                {errors.current_balance && (
                                    <p className="mt-2 text-sm text-red-600">{errors.current_balance}</p>
                                )}
                            </div>
                        </div>

                        {/* Calculation Preview */}
                        {(data.product_delivery_amount || data.expense_amount) && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Calculation Preview</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Amount:</span>
                                        <span className="font-medium">৳{parseFloat(data.product_delivery_amount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expense Amount:</span>
                                        <span className="font-medium">৳{parseFloat(data.expense_amount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-300">
                                        <span className="font-semibold text-gray-800">Net Balance:</span>
                                        <span className={`font-bold
                                            ${parseFloat(data.total_amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}
                                        `}>
                                            ৳{parseFloat(data.total_amount || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Original vs Current Comparison */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Original vs Current Values</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Original Balance:</span>
                                    <span className={`block font-medium ${
                                        parseFloat(balanceSheet.current_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        ৳{parseFloat(balanceSheet.current_balance || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Updated Balance:</span>
                                    <span className={`block font-medium ${
                                        parseFloat(data.current_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        ৳{parseFloat(data.current_balance || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                                <DocumentTextIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 ml-3">Additional Notes</h3>
                        </div>

                        <div>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Add any additional notes or comments about this balance sheet..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                            />
                            {errors.notes && (
                                <p className="mt-2 text-sm text-red-600">{errors.notes}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-end space-x-4">
                            <Link
                                href={`/balance-sheets/${balanceSheet.id}`}
                                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-xl hover:bg-gray-600 transition-colors duration-200"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="h-5 w-5 mr-2" />
                                        Update Balance Sheet
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
