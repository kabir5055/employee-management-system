import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UserGroupIcon,
    CurrencyDollarIcon,
    TruckIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    PlusIcon,
    ArrowTrendingUpIcon,
    BanknotesIcon,
    BuildingOfficeIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement, Filler } from 'chart.js';
import { Line as ChartJSLine, Bar as ChartJSBar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    ChartTooltip,
    ChartLegend,
    ArcElement,
    Filler
);

export default function Dashboard({ auth, stats, monthlySalesData, topProductsData, topEmployees, recentDeliveries }) {
    const statCards = [
        {
            title: 'Total Employees',
            value: stats?.totalEmployees || 0,
            icon: UserGroupIcon,
            gradient: 'from-blue-500 to-indigo-600',
            change: '+12%',
            changeType: 'increase',
            description: 'vs last month'
        },
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: TruckIcon,
            gradient: 'from-emerald-500 to-teal-600',
            change: '+8%',
            changeType: 'increase',
            description: 'vs last month'
        },
        {
            title: 'Total Deliveries',
            value: stats?.totalDeliveries || 0,
            icon: DocumentTextIcon,
            gradient: 'from-purple-500 to-pink-600',
            change: '+15%',
            changeType: 'increase',
            description: 'this month'
        },
        {
            title: 'Total Revenue',
            value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: BanknotesIcon,
            gradient: 'from-orange-500 to-red-600',
            change: '+23%',
            changeType: 'increase',
            description: 'vs last month'
        },
    ];

    // Sample data for charts if none provided
    const salesChartData = monthlySalesData?.labels && monthlySalesData?.values ?
        monthlySalesData.labels.map((label, index) => ({
            month: label,
            sales: monthlySalesData.values[index] || 0,
            expenses: monthlySalesData.expenses ? monthlySalesData.expenses[index] || 0 : 0
        })) :
        [
            { month: 'Jan', sales: 4000, expenses: 2000 },
            { month: 'Feb', sales: 3000, expenses: 1800 },
            { month: 'Mar', sales: 5000, expenses: 2200 },
            { month: 'Apr', sales: 4500, expenses: 2100 },
            { month: 'May', sales: 6000, expenses: 2500 },
            { month: 'Jun', sales: 5500, expenses: 2300 },
        ];

    const productPerformanceData = topProductsData?.labels && topProductsData?.values ?
        topProductsData.labels.map((label, index) => ({
            name: label,
            value: topProductsData.values[index] || 0
        })) :
        [
            { name: 'Product A', value: 400 },
            { name: 'Product B', value: 300 },
            { name: 'Product C', value: 200 },
            { name: 'Product D', value: 100 },
        ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    // Chart.js configuration for line chart
    const chartJSData = {
        labels: salesChartData.map(item => item.month),
        datasets: [{
            label: 'Monthly Sales',
            data: salesChartData.map(item => item.sales),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#10b981',
            pointHoverBackgroundColor: '#10b981',
            pointHoverBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 3
        }]
    };

    const chartJSOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#374151',
                bodyColor: '#6b7280',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Sales: ৳${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    },
                    callback: function(value) {
                        return '৳' + (value / 1000) + 'k';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 4,
                hoverRadius: 6,
                backgroundColor: '#ffffff',
                borderWidth: 2
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route('employees.create')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Employee
                        </Link>
                        <Link
                            href={route('reports.index')}
                            className="inline-flex items-center px-4 py-2 bg-white/80 text-gray-700 text-sm font-medium rounded-xl border border-white/50 hover:bg-white hover:shadow-md transition-all duration-200"
                        >
                            <ChartBarIcon className="h-4 w-4 mr-2" />
                            View Reports
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {auth.user.name}!</h1>
                            <p className="text-indigo-100 text-lg">Here's what's happening with your business today.</p>
                            <div className="mt-4 flex items-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <CalendarDaysIcon className="h-5 w-5" />
                                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <BuildingOfficeIcon className="h-5 w-5" />
                                    <span>EMS Pro Dashboard</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <ArrowTrendingUpIcon className="h-16 w-16 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={card.title}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg`}>
                                    <card.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center space-x-1 text-sm font-medium ${
                                    card.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                    {card.changeType === 'increase' ? (
                                        <ArrowUpIcon className="h-4 w-4" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4" />
                                    )}
                                    <span>{card.change}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800 mb-1">{card.value}</p>
                                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                <p className="text-xs text-gray-500">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts and Tables Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Sales Chart */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Monthly Sales Trend</h3>
                            <Link
                                href={route('reports.monthly-trends')}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <EyeIcon className="h-4 w-4" />
                                <span>View Details</span>
                            </Link>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `৳${(value / 1000)}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                        }}
                                        formatter={(value, name) => [`৳${value.toLocaleString()}`, 'Sales']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Product Performance Chart */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Product Performance</h3>
                            <Link
                                href={route('reports.product-performance')}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <EyeIcon className="h-4 w-4" />
                                <span>View Details</span>
                            </Link>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={productPerformanceData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                        outerRadius={85}
                                        innerRadius={20}
                                        fill="#8884d8"
                                        dataKey="value"
                                        paddingAngle={2}
                                    >
                                        {productPerformanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                        }}
                                        formatter={(value, name) => [`৳${value.toLocaleString()}`, 'Revenue']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
                            <Link
                                href={route('reports.top-performers')}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <EyeIcon className="h-4 w-4" />
                                <span>View All</span>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {topEmployees && topEmployees.slice(0, 5).map((employee, index) => (
                                <div key={employee.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                                index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                                                'bg-gradient-to-r from-indigo-400 to-purple-500'
                                            }`}>
                                                {employee.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-800 truncate">{employee.name}</p>
                                            <p className="text-xs text-gray-500">{employee.deliveries_count} deliveries</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800">৳{(employee.total_amount || 0).toLocaleString()}</p>
                                        <div className="flex items-center space-x-1">
                                            {index < 3 && (
                                                <div className={`w-2 h-2 rounded-full ${
                                                    index === 0 ? 'bg-yellow-400' :
                                                    index === 1 ? 'bg-gray-400' :
                                                    'bg-orange-400'
                                                }`}></div>
                                            )}
                                            <span className="text-xs text-gray-500">#{index + 1}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue vs Expenses Bar Chart */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Revenue vs Expenses</h3>
                            <Link
                                href={route('reports.yearly-comparison')}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <EyeIcon className="h-4 w-4" />
                                <span>View Details</span>
                            </Link>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `৳${(value / 1000)}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                        }}
                                        formatter={(value, name) => [`৳${value.toLocaleString()}`, name]}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="sales"
                                        fill="#10b981"
                                        radius={[4, 4, 0, 0]}
                                        name="Revenue"
                                    />
                                    <Bar
                                        dataKey="expenses"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                        name="Expenses"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity Chart */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Monthly Activity Overview</h3>
                            <Link
                                href={route('reports.delivery-stats')}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <EyeIcon className="h-4 w-4" />
                                <span>View Details</span>
                            </Link>
                        </div>
                        <div className="h-64">
                            <ChartJSLine data={chartJSData} options={chartJSOptions} />
                        </div>
                    </div>
                </div>

                {/* Employee Performance and Recent Deliveries */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Performers */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
                            <Link
                                href={route('reports.top-performers')}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <EyeIcon className="h-4 w-4" />
                                <span>View All</span>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {topEmployees && topEmployees.slice(0, 5).map((employee, index) => (
                                <div key={employee.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                                index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                                                'bg-gradient-to-r from-indigo-400 to-purple-500'
                                            }`}>
                                                {employee.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-800 truncate">{employee.name}</p>
                                            <p className="text-xs text-gray-500">{employee.deliveries_count} deliveries</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800">৳{(employee.total_amount || 0).toLocaleString()}</p>
                                        <div className="flex items-center space-x-1">
                                            {index < 3 && (
                                                <div className={`w-2 h-2 rounded-full ${
                                                    index === 0 ? 'bg-yellow-400' :
                                                    index === 1 ? 'bg-gray-400' :
                                                    'bg-orange-400'
                                                }`}></div>
                                            )}
                                            <span className="text-xs text-gray-500">#{index + 1}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Deliveries */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Deliveries</h3>
                            <Link
                                href="/product-deliveries"
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                            >
                                <EyeIcon className="h-4 w-4" />
                                <span>View All</span>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentDeliveries && recentDeliveries.slice(0, 5).map((delivery, index) => (
                                <div key={delivery.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {delivery.product_name?.charAt(0) || 'P'}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-800 truncate">{delivery.product_name}</p>
                                            <p className="text-xs text-gray-500">by {delivery.employee_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800">৳{(delivery.amount || 0).toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">{delivery.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Add Employee', href: route('employees.create'), icon: UserGroupIcon, color: 'from-blue-500 to-indigo-600' },
                            { name: 'New Product', href: route('products.create'), icon: TruckIcon, color: 'from-emerald-500 to-teal-600' },
                            { name: 'Add Delivery', href: '/product-deliveries/create', icon: DocumentTextIcon, color: 'from-purple-500 to-pink-600' },
                            { name: 'Record Expense', href: route('expenses.create'), icon: CurrencyDollarIcon, color: 'from-orange-500 to-red-600' },
                            { name: 'View Reports', href: route('reports.index'), icon: ChartBarIcon, color: 'from-indigo-500 to-purple-600' },
                            { name: 'Settings', href: route('settings.index'), icon: BuildingOfficeIcon, color: 'from-gray-500 to-gray-700' },
                        ].map((action) => (
                            <Link
                                key={action.name}
                                href={action.href}
                                className="group flex flex-col items-center p-4 bg-white/50 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200"
                            >
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                    <action.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="mt-2 text-xs font-medium text-gray-700 text-center">{action.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
