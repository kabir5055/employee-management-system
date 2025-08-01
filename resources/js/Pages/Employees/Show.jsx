import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    CalendarIcon,
    PencilIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, employee }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return 'N/A';
        return `৳${parseFloat(amount).toLocaleString()}`;
    };

    const calculateTotalSalary = (salary) => {
        const basic = parseFloat(salary.basic_salary) || 0;
        const houseRent = parseFloat(salary.house_rent) || 0;
        const medical = parseFloat(salary.medical_allowance) || 0;
        const transport = parseFloat(salary.transport_allowance) || 0;
        const food = parseFloat(salary.food_allowance) || 0;
        const other = parseFloat(salary.other_allowance) || 0;

        return basic + houseRent + medical + transport + food + other;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Employee Details</h2>}
        >
            <Head title={`Employee - ${employee.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('employees.index')}
                                        className="inline-flex items-center px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-l"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Back
                                    </Link>
                                    <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
                                </div>
                                <Link
                                    href={route('employees.edit', { employee: employee.id })}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Edit Employee
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <UserIcon className="w-5 h-5 mr-2" />
                                        Personal Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                            <p className="text-lg text-gray-900">{employee.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Email</label>
                                            <p className="text-lg text-gray-900 flex items-center">
                                                <EnvelopeIcon className="w-4 h-4 mr-2" />
                                                {employee.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Phone</label>
                                            <p className="text-lg text-gray-900 flex items-center">
                                                <PhoneIcon className="w-4 h-4 mr-2" />
                                                {employee.phone || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                                            <p className="text-lg text-gray-900">
                                                {employee.date_of_birth ? formatDate(employee.date_of_birth) : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">NID Number</label>
                                            <p className="text-lg text-gray-900">{employee.nid_number || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">District</label>
                                            <p className="text-lg text-gray-900">{employee.district?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Upazila</label>
                                            <p className="text-lg text-gray-900">{employee.upazila?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <BriefcaseIcon className="w-5 h-5 mr-2" />
                                        Employment Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                                            <p className="text-lg text-gray-900">{employee.employee_id}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Department</label>
                                            <p className="text-lg text-gray-900 flex items-center">
                                                <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                                                {employee.department?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Position</label>
                                            <p className="text-lg text-gray-900 flex items-center">
                                                <BriefcaseIcon className="w-4 h-4 mr-2" />
                                                {employee.position?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Joining Date</label>
                                            <p className="text-lg text-gray-900 flex items-center">
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                {employee.joining_date ? formatDate(employee.joining_date) : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Current Salary</label>
                                            <p className="text-lg text-gray-900">
                                                {employee.current_salary ? formatCurrency(employee.current_salary) : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Status</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                employee.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {employee.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Address</label>
                                        <p className="text-lg text-gray-900">{employee.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Role</label>
                                        <p className="text-lg text-gray-900 capitalize">{employee.role || 'Employee'}</p>
                                    </div>
                                    {employee.leaving_date && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Leaving Date</label>
                                            <p className="text-lg text-gray-900">{formatDate(employee.leaving_date)}</p>
                                        </div>
                                    )}
                                    {employee.thana?.name && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Thana</label>
                                            <p className="text-lg text-gray-900">{employee.thana.name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Promotion History */}
                            {employee.promotions && employee.promotions.length > 0 && (
                                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Promotion History</h3>
                                    <div className="space-y-3">
                                        {employee.promotions.map((promotion, index) => (
                                            <div key={index} className="bg-white p-4 rounded border">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            From: {promotion.previous_position?.name || 'N/A'} → To: {promotion.new_position?.name || 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Date: {formatDate(promotion.effective_date)}
                                                        </p>
                                                        {promotion.notes && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Notes: {promotion.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Salary Structures */}
                            {employee.salary_structures && employee.salary_structures.length > 0 && (
                                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary History</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">House Rent</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">Medical</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">Transport</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">Food</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">Other</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employee.salary_structures.slice(0, 5).map((salary, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="py-2 px-4 border-b">{formatCurrency(salary.basic_salary)}</td>
                                                        <td className="py-2 px-4 border-b">{formatCurrency(salary.house_rent)}</td>
                                                        <td className="py-2 px-4 border-b">{formatCurrency(salary.medical_allowance)}</td>
                                                        <td className="py-2 px-4 border-b">{formatCurrency(salary.transport_allowance)}</td>
                                                        <td className="py-2 px-4 border-b">{formatCurrency(salary.food_allowance)}</td>
                                                        <td className="py-2 px-4 border-b">{formatCurrency(salary.other_allowance)}</td>
                                                        <td className="py-2 px-4 border-b font-medium bg-blue-50">{formatCurrency(calculateTotalSalary(salary))}</td>
                                                        <td className="py-2 px-4 border-b text-sm text-gray-600">{formatDate(salary.effective_from || salary.created_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Recent Collections */}
                            {employee.collections && employee.collections.length > 0 && (
                                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Collections</h3>
                                    <div className="space-y-3">
                                        {employee.collections.slice(0, 5).map((collection, index) => (
                                            <div key={index} className="bg-white p-4 rounded border flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900">Amount: {formatCurrency(collection.amount_collected)}</p>
                                                    <p className="text-sm text-gray-600">Date: {formatDate(collection.collection_date || collection.created_at)}</p>
                                                    {collection.notes && (
                                                        <p className="text-sm text-gray-600">Notes: {collection.notes}</p>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    collection.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : collection.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {collection.status || 'Pending'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Expenses */}
                            {employee.expenses && employee.expenses.length > 0 && (
                                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
                                    <div className="space-y-3">
                                        {employee.expenses.slice(0, 5).map((expense, index) => (
                                            <div key={index} className="bg-white p-4 rounded border flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900">{expense.category || 'Expense'}</p>
                                                    <p className="text-lg text-gray-900">Amount: {formatCurrency(expense.amount)}</p>
                                                    <p className="text-sm text-gray-600">Date: {formatDate(expense.expense_date)}</p>
                                                    {expense.description && (
                                                        <p className="text-sm text-gray-600">Description: {expense.description}</p>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    expense.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : expense.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {expense.status || 'Pending'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
