import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ChartBarIcon,
    UsersIcon,
    TruckIcon,
    CubeIcon,
    CalendarIcon,
    ArrowTrendingUpIcon,
    TrophyIcon,
    ClockIcon,
    BanknotesIcon,
    PresentationChartLineIcon,
    ChartPieIcon
} from '@heroicons/react/24/outline';

export default function ReportsIndex({ auth }) {
    const reportCards = [
        {
            title: 'Employee Balances',
            description: 'View current balance status of all employees',
            icon: BanknotesIcon,
            url: '/reports/employee-balances',
            color: 'bg-blue-500 hover:bg-blue-600',
            stats: 'Account balances overview'
        },
        {
            title: 'Delivery Statistics',
            description: 'Analyze delivery performance and commission rates',
            icon: TruckIcon,
            url: '/reports/delivery-stats',
            color: 'bg-green-500 hover:bg-green-600',
            stats: 'Performance metrics'
        },
        {
            title: 'Product Performance',
            description: 'Track product sales and delivery statistics',
            icon: CubeIcon,
            url: '/reports/product-performance',
            color: 'bg-purple-500 hover:bg-purple-600',
            stats: 'Product analytics'
        },
        {
            title: 'Yearly Comparison',
            description: 'Compare yearly sales and performance trends',
            icon: ChartBarIcon,
            url: '/reports/yearly-comparison',
            color: 'bg-orange-500 hover:bg-orange-600',
            stats: 'Year-over-year analysis'
        },
        {
            title: 'Monthly Trends',
            description: 'Monitor monthly sales patterns and trends',
            icon: ArrowTrendingUpIcon,
            url: '/reports/monthly-trends',
            color: 'bg-indigo-500 hover:bg-indigo-600',
            stats: 'Monthly analysis'
        },
        {
            title: 'Top Performers',
            description: 'Identify highest performing employees',
            icon: TrophyIcon,
            url: '/reports/top-performers',
            color: 'bg-yellow-500 hover:bg-yellow-600',
            stats: 'Performance rankings'
        }
    ];

    const quickStats = [
        {
            title: 'Financial Reports',
            count: '3',
            icon: BanknotesIcon,
            color: 'text-blue-600 bg-blue-100'
        },
        {
            title: 'Performance Reports',
            count: '2',
            icon: ArrowTrendingUpIcon,
            color: 'text-green-600 bg-green-100'
        },
        {
            title: 'Analytics Reports',
            count: '1',
            icon: ChartPieIcon,
            color: 'text-purple-600 bg-purple-100'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Reports & Analytics
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Comprehensive business intelligence and performance reports
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <PresentationChartLineIcon className="h-8 w-8 text-gray-600" />
                    </div>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Quick Stats */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {quickStats.map((stat, index) => (
                                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className={`inline-flex items-center justify-center p-3 rounded-md ${stat.color}`}>
                                                    <stat.icon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        {stat.title}
                                                    </dt>
                                                    <dd className="text-lg font-medium text-gray-900">
                                                        {stat.count} Available
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Report Cards */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Reports</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reportCards.map((report, index) => (
                                <Link
                                    key={index}
                                    href={report.url}
                                    className="group bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`inline-flex items-center justify-center p-3 rounded-lg ${report.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                                                <report.icon className="h-6 w-6" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide">
                                                    {report.stats}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-700">
                                                {report.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {report.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-700">
                                            <span>View Report</span>
                                            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-gray-900">Report Information</h4>
                                <div className="mt-2 text-sm text-gray-600">
                                    <ul className="space-y-1">
                                        <li>• Reports are generated in real-time based on current data</li>
                                        <li>• Date ranges can be customized in individual reports</li>
                                        <li>• Export functionality available for detailed analysis</li>
                                        <li>• All monetary values are displayed in Bangladeshi Taka (৳)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
