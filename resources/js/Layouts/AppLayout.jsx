import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import {
    HomeIcon,
    UserGroupIcon,
    CubeIcon,
    TruckIcon,
    BanknotesIcon,
    KeyIcon,
    ShieldCheckIcon,
    CogIcon,
    ChartBarIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronUpDownIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Fragment } from 'react';

export default function AppLayout({ title, header, children }) {
    const { auth, settings } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const isCurrentRoute = (pattern) => {
        const currentRouteName = route().current();
        return pattern === currentRouteName ||
               (pattern.endsWith('*') && currentRouteName?.startsWith(pattern.slice(0, -2)));
    };

    const isSuperAdmin = () => {
        return auth?.user?.is_super_admin || false;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 z-50 flex-wrap items-center justify-between block w-full p-0 antialiased transition-transform duration-200 bg-white border-0 shadow-xl lg:left-0 lg:translate-x-0 lg:block lg:fixed lg:top-0 lg:bottom-0 lg:max-w-64 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="h-full px-4 py-6">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href={route('dashboard')} className="flex items-center">
                            {settings?.app_logo ? (
                                <img
                                    src={settings.app_logo}
                                    className="h-8 w-auto mr-3"
                                    alt={settings?.app_name}
                                />
                            ) : (
                                <ApplicationLogo className="block h-8 w-auto fill-current text-gray-800" />
                            )}
                            <span className="ml-3 text-xl font-semibold">
                                {settings?.app_name || 'EMS'}
                            </span>
                        </Link>
                        <button onClick={toggleSidebar} className="lg:hidden">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                isCurrentRoute('dashboard')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <HomeIcon className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>

                        <Link
                            href={route('employees.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                isCurrentRoute('employees.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <UserGroupIcon className="w-5 h-5 mr-3" />
                            Employees
                        </Link>

                        <Link
                            href={route('products.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                isCurrentRoute('products.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <CubeIcon className="w-5 h-5 mr-3" />
                            Products
                        </Link>

                        <Link
                            href={route('product-deliveries.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                isCurrentRoute('product-deliveries.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <TruckIcon className="w-5 h-5 mr-3" />
                            Deliveries
                        </Link>

                        <Link
                            href={route('balance-sheets.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                isCurrentRoute('balance-sheets.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <BanknotesIcon className="w-5 h-5 mr-3" />
                            Balance Sheets
                        </Link>

                        <Link
                            href={route('expenses.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                isCurrentRoute('expenses.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <CurrencyDollarIcon className="w-5 h-5 mr-3" />
                            Expenses
                        </Link>

                        <Link
                            href={route('reports.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                isCurrentRoute('reports.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <ChartBarIcon className="w-5 h-5 mr-3" />
                            Reports
                        </Link>

                        {/* Admin Section - Only for Super Admin */}
                        {isSuperAdmin() && (
                            <>
                                <div className="border-t border-gray-200 my-4 pt-4">
                                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Administration
                                    </p>
                                </div>

                                <Link
                                    href={route('admin.user-permissions')}
                                    className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                        isCurrentRoute('admin.*')
                                            ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <UserGroupIcon className="w-5 h-5 mr-3" />
                                    User Management
                                </Link>

                                <Link
                                    href={route('roles.index')}
                                    className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                        isCurrentRoute('roles.*')
                                            ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <ShieldCheckIcon className="w-5 h-5 mr-3" />
                                    Roles
                                </Link>

                                <Link
                                    href={route('permissions.index')}
                                    className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                        isCurrentRoute('permissions.*')
                                            ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <KeyIcon className="w-5 h-5 mr-3" />
                                    Permissions
                                </Link>

                                <Link
                                    href={route('settings.index')}
                                    className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                                        isCurrentRoute('settings.*')
                                            ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <CogIcon className="w-5 h-5 mr-3" />
                                    Settings
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* User Menu */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                                <img
                                    className="w-8 h-8 mr-3 rounded-full"
                                    src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&color=7c3aed&background=ede9fe`}
                                    alt={auth.user.name}
                                />
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {isSuperAdmin() ? 'Super Admin' : 'Employee'}
                                    </p>
                                </div>
                                <ChevronUpDownIcon className="w-4 h-4" />
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute bottom-full left-0 right-0 mb-2 origin-bottom-right bg-white rounded-lg shadow-lg">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('profile.edit')}
                                                    className={`${
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                    } block px-4 py-2 text-sm`}
                                                >
                                                    Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className={`${
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                    } block w-full text-left px-4 py-2 text-sm`}
                                                >
                                                    Log Out
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex flex-col min-h-screen transition-all duration-200 ${
                sidebarOpen ? 'lg:ml-64' : ''
            }`}>
                {/* Top Bar */}
                <header className="relative z-40 bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-4 lg:px-6">
                        {/* Mobile Menu Button */}
                        <button onClick={toggleSidebar} className="lg:hidden">
                            <Bars3Icon className="w-6 h-6" />
                        </button>

                        {/* Search (optional) */}
                        <div className="flex-1 hidden px-4 lg:block">
                            {/* Add search functionality if needed */}
                        </div>

                        {/* Right Navigation */}
                        <div className="flex items-center">
                            {/* Add notifications, etc. if needed */}
                        </div>
                    </div>
                </header>

                {/* Page Heading */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
