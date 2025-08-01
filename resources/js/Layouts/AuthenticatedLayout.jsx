import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/useFlashMessages';
import { useFormErrors } from '@/hooks/useFormErrors';
import {
    HomeIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    TruckIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CogIcon,
    Bars3Icon,
    XMarkIcon,
    ShieldCheckIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    BanknotesIcon,
    ArrowTrendingUpIcon,
    DocumentArrowUpIcon,
    UsersIcon,
    KeyIcon,
    BriefcaseIcon,
    UserIcon,
    IdentificationIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { url } = usePage();

    // Handle flash messages with toasts
    useFlashMessages();

    // Handle form validation errors with toasts
    useFormErrors();

    // Helper function to check if user is super admin
    const isSuperAdmin = () => {
        return user?.is_super_admin === true;
    };

    // Helper function to check if route is current
    const isCurrentRoute = (routeName) => {
        const currentPath = url;

        if (routeName === 'dashboard') {
            return currentPath === '/dashboard';
        }

        if (routeName === 'employees.*') {
            return currentPath.startsWith('/employees');
        }

        if (routeName === 'products.*') {
            return currentPath.startsWith('/products');
        }

        if (routeName === 'positions.*') {
            return currentPath.startsWith('/positions');
        }

        if (routeName === 'departments.*') {
            return currentPath.startsWith('/departments');
        }

        if (routeName === 'personal-info.*') {
            return currentPath.startsWith('/personal-info');
        }

        if (routeName === 'employee-promotions.*') {
            return currentPath.startsWith('/employee-promotions');
        }

        if (routeName === 'product-deliveries.*') {
            return currentPath.startsWith('/product-deliveries');
        }

        if (routeName === 'balance-sheets.*') {
            return currentPath.startsWith('/balance-sheets');
        }

        if (routeName === 'expenses.*') {
            return currentPath.startsWith('/expenses');
        }

        if (routeName === 'reports.*') {
            return currentPath.startsWith('/reports');
        }

        if (routeName === 'admin.*') {
            return currentPath.startsWith('/admin');
        }

        if (routeName === 'admin.users.*') {
            return currentPath.startsWith('/admin/users');
        }

        if (routeName === 'roles.*') {
            return currentPath.startsWith('/roles');
        }

        if (routeName === 'permissions.*') {
            return currentPath.startsWith('/permissions');
        }

        if (routeName === 'settings.*') {
            return currentPath.startsWith('/settings');
        }

        return false;
    };

    // Define navigation sections with permissions
    // Define navigation sections
    const navigationSections = [
        {
            title: 'Dashboard',
            items: [
                {
                    name: 'Dashboard',
                    href: route('dashboard'),
                    icon: HomeIcon,
                    current: isCurrentRoute('dashboard')
                },
            ]
        },
        {
            title: 'Employee Management',
            items: [
                {
                    name: 'Employees',
                    href: route('employees.index'),
                    icon: UserGroupIcon,
                    current: isCurrentRoute('employees.*')
                },
                {
                    name: 'Departments',
                    href: route('departments.index'),
                    icon: BuildingOfficeIcon,
                    current: isCurrentRoute('departments.*')
                },
                {
                    name: 'Positions',
                    href: route('positions.index'),
                    icon: BriefcaseIcon,
                    current: isCurrentRoute('positions.*')
                },
                {
                    name: 'Personal Information',
                    href: route('personal-info.index'),
                    icon: IdentificationIcon,
                    current: isCurrentRoute('personal-info.*')
                },
                {
                    name: 'Promotion History',
                    href: route('employee-promotions.index'),
                    icon: TrophyIcon,
                    current: isCurrentRoute('employee-promotions.*')
                },
            ]
        },
        {
            title: 'Operations',
            items: [
                {
                    name: 'Products',
                    href: route('products.index'),
                    icon: TruckIcon,
                    current: isCurrentRoute('products.*')
                },
                {
                    name: 'Product Deliveries',
                    href: route('product-deliveries.index'),
                    icon: DocumentTextIcon,
                    current: isCurrentRoute('product-deliveries.*')
                },
                {
                    name: 'Balance Sheets',
                    href: route('balance-sheets.index'),
                    icon: BanknotesIcon,
                    current: isCurrentRoute('balance-sheets.*')
                },
                {
                    name: 'Expenses',
                    href: route('expenses.index'),
                    icon: CurrencyDollarIcon,
                    current: isCurrentRoute('expenses.*')
                },
            ]
        },
        {
            title: 'Reports & Analytics',
            items: [
                {
                    name: 'Reports',
                    href: route('reports.index'),
                    icon: ChartBarIcon,
                    current: isCurrentRoute('reports.*')
                },
            ]
        }
    ];

    // Add admin section if user is super admin
    if (isSuperAdmin()) {
        navigationSections.push({
            title: 'Administration',
            items: [
                {
                    name: 'User Management',
                    href: route('admin.users.index'),
                    icon: UsersIcon,
                    current: isCurrentRoute('admin.users.*')
                },
                {
                    name: 'Settings',
                    href: route('settings.index'),
                    icon: CogIcon,
                    current: isCurrentRoute('settings.*')
                },
            ]
        });
    }

    // No filtering needed - just use the sections as-is
    const filteredNavigation = navigationSections;

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl flex flex-col`}>
                <div className="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-700 flex-shrink-0">
                    {!sidebarCollapsed ? (
                        <>
                            <ApplicationLogo className="block h-9 w-auto fill-current text-blue-400" />
                            <span className="ml-2 text-white font-bold text-xl tracking-wide">EMS</span>
                        </>
                    ) : (
                        <ApplicationLogo className="block h-8 w-auto fill-current text-blue-400" />
                    )}
                </div>

                <nav className="flex-1 mt-5 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {filteredNavigation.map((section, sectionIndex) => (
                        <div key={section.title} className={sectionIndex > 0 ? 'mt-8' : ''}>
                            {!sidebarCollapsed && (
                                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {section.title}
                                </h3>
                            )}
                            <div className={`${!sidebarCollapsed ? 'mt-2' : ''} space-y-1`}>
                                {section.items.map((item) => (
                                    <div key={item.name} className="relative group">
                                        <Link
                                            href={item.href}
                                            className={`${
                                                item.current
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            } group flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${!sidebarCollapsed && 'transform hover:scale-105'}`}
                                        >
                                            <item.icon
                                                className={`${
                                                    item.current
                                                        ? 'text-white'
                                                        : 'text-gray-400 group-hover:text-white'
                                                } ${sidebarCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'}`}
                                            />
                                            {!sidebarCollapsed && item.name}
                                        </Link>
                                        {sidebarCollapsed && (
                                            <div className="absolute left-full ml-2 top-0 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User info at bottom */}
                <div className="flex-shrink-0 p-4 bg-gray-800 border-t border-gray-700">
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        {!sidebarCollapsed && (
                            <div className="ml-3 min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user?.roles?.[0]?.name?.replace('-', ' ').toUpperCase() || 'Employee'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200 z-10"
                >
                    {sidebarCollapsed ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                {/* Top navigation */}
                <div className="flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex-1 px-4 flex justify-between items-center min-w-0">
                        <div className="flex-1 min-w-0">
                            {header && (
                                <header className="py-2">
                                    <div className="text-lg font-semibold text-gray-900 truncate">{header}</div>
                                </header>
                            )}
                        </div>

                        <div className="ml-4 flex items-center md:ml-6">
                            {/* User dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {user?.name}
                                            <svg
                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 hide-scrollbar">
                    <div className="py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
