import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
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
    KeyIcon
} from '@heroicons/react/24/outline';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    // Helper function to check if user has permission
    const hasPermission = (permission) => {
        return user?.all_permissions?.some(p => p.name === permission) ||
               user?.roles?.some(role => role.name === 'super-admin');
    };

    // Helper function to check if user has role
    const hasRole = (roleName) => {
        return user?.roles?.some(role => role.name === roleName);
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

        if (routeName === 'admin.*') {
            return currentPath.startsWith('/admin');
        }

        if (routeName === 'roles.*') {
            return currentPath.startsWith('/roles');
        }

        if (routeName === 'permissions.*') {
            return currentPath.startsWith('/permissions');
        }

        return false;
    };

    // Define navigation sections with permissions
    const navigationSections = [
        {
            title: 'Dashboard',
            items: [
                {
                    name: 'Dashboard',
                    href: route('dashboard'),
                    icon: HomeIcon,
                    current: isCurrentRoute('dashboard'),
                    permission: 'view-dashboard'
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
                    current: isCurrentRoute('employees.*'),
                    permission: 'view-employees'
                },
            ]
        },
        {
            title: 'Operations',
            items: [
                {
                    name: 'Products',
                    href: '#',
                    icon: TruckIcon,
                    current: false,
                    permission: 'view-products'
                },
                {
                    name: 'Collections',
                    href: '#',
                    icon: DocumentTextIcon,
                    current: false,
                    permission: 'view-collections'
                },
                {
                    name: 'Expenses',
                    href: '#',
                    icon: BanknotesIcon,
                    current: false,
                    permission: 'view-expenses'
                },
            ]
        },
        {
            title: 'Reports & Analytics',
            items: [
                {
                    name: 'Reports',
                    href: '#',
                    icon: ChartBarIcon,
                    current: false,
                    permission: 'view-reports'
                },
            ]
        },
        {
            title: 'Administration',
            items: [
                {
                    name: 'User Management',
                    href: route('admin.user-permissions'),
                    icon: UsersIcon,
                    current: isCurrentRoute('admin.*'),
                    permission: 'view-users',
                    roles: ['super-admin', 'admin']
                },
                {
                    name: 'Roles',
                    href: route('roles.index'),
                    icon: ShieldCheckIcon,
                    current: isCurrentRoute('roles.*'),
                    permission: 'view-roles',
                    roles: ['super-admin']
                },
                {
                    name: 'Permissions',
                    href: route('permissions.index'),
                    icon: KeyIcon,
                    current: isCurrentRoute('permissions.*'),
                    permission: 'view-permissions',
                    roles: ['super-admin']
                },
                {
                    name: 'Settings',
                    href: '#',
                    icon: CogIcon,
                    current: false,
                    permission: 'view-settings'
                },
            ]
        },
    ];

    // Filter navigation items based on permissions and roles
    const filteredNavigation = navigationSections.map(section => ({
        ...section,
        items: section.items.filter(item => {
            // Check permission
            if (item.permission && !hasPermission(item.permission)) {
                return false;
            }

            // Check roles if specified
            if (item.roles && !item.roles.some(role => hasRole(role))) {
                return false;
            }

            return true;
        })
    })).filter(section => section.items.length > 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}>
                <div className="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-700">
                    <ApplicationLogo className="block h-9 w-auto fill-current text-blue-400" />
                    <span className="ml-2 text-white font-bold text-xl tracking-wide">EMS</span>
                </div>

                <nav className="mt-5 px-2 overflow-y-auto h-full pb-20">
                    {filteredNavigation.map((section, sectionIndex) => (
                        <div key={section.title} className={sectionIndex > 0 ? 'mt-8' : ''}>
                            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`${
                                            item.current
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105`}
                                    >
                                        <item.icon
                                            className={`${
                                                item.current
                                                    ? 'text-white'
                                                    : 'text-gray-400 group-hover:text-white'
                                            } mr-3 h-5 w-5`}
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-gray-400">
                                {user?.roles?.[0]?.name?.replace('-', ' ').toUpperCase() || 'Employee'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                </div>
            )}

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Top navigation */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1">
                            {header && (
                                <header className="py-2">
                                    <div className="text-lg font-semibold text-gray-900">{header}</div>
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
                <main className="flex-1">
                    <div className="py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
