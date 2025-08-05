import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'react-hot-toast';

// Set up a comprehensive route function without Ziggy
window.route = function(name, params = {}) {
    // Define all application routes
    const routes = {
        'dashboard': '/dashboard',
        'employees.index': '/employees',
        'employees.create': '/employees/create',
        'employees.show': '/employees/{employee}',
        'employees.edit': '/employees/{employee}/edit',
        'employees.store': '/employees',
        'employees.update': '/employees/{employee}',
        'employees.destroy': '/employees/{employee}',
        'employees.export': '/employees/export',
        'employees.import': '/employees/import',
        'employees.personal-info': '/employees/{employee}/personal-info',
        'employees.update-personal-info': '/employees/{employee}/personal-info',
        'personal-info.index': '/personal-info',
        'personal-info.create': '/personal-info/create',
        'personal-info.show': '/personal-info/{personal_info}',
        'personal-info.edit': '/personal-info/{personal_info}/edit',
        'personal-info.store': '/personal-info',
        'personal-info.update': '/personal-info/{personal_info}',
        'personal-info.destroy': '/personal-info/{personal_info}',
        'profile.edit': '/profile',
        'logout': '/logout',
        'balance-sheets.index': '/balance-sheets',
        'balance-sheets.show': '/balance-sheets/{employee}',
        'balance-sheets.update-balance': '/balance-sheets/{employee}/update-balance',
        'products.index': '/products',
        'products.create': '/products/create',
        'products.show': '/products/{product}',
        'products.edit': '/products/{product}/edit',
        'products.store': '/products',
        'products.update': '/products/{product}',
        'products.destroy': '/products/{product}',
        'products.update-stock': '/products/{product}/update-stock',
        'product-categories.index': '/product-categories',
        'product-categories.create': '/product-categories/create',
        'product-categories.show': '/product-categories/{product_category}',
        'product-categories.edit': '/product-categories/{product_category}/edit',
        'product-categories.store': '/product-categories',
        'product-categories.update': '/product-categories/{product_category}',
        'product-categories.destroy': '/product-categories/{product_category}',
        'product-units.index': '/product-units',
        'product-units.create': '/product-units/create',
        'product-units.show': '/product-units/{product_unit}',
        'product-units.edit': '/product-units/{product_unit}/edit',
        'product-units.store': '/product-units',
        'product-units.update': '/product-units/{product_unit}',
        'product-units.destroy': '/product-units/{product_unit}',
        'product-deliveries.index': '/product-deliveries',
        'product-deliveries.create': '/product-deliveries/create',
        'product-deliveries.show': '/product-deliveries/{product_delivery}',
        'product-deliveries.edit': '/product-deliveries/{product_delivery}/edit',
        'product-deliveries.store': '/product-deliveries',
        'product-deliveries.update': '/product-deliveries/{product_delivery}',
        'product-deliveries.destroy': '/product-deliveries/{product_delivery}',
        'product-adjustments.index': '/product-adjustments',
        'product-adjustments.create': '/product-adjustments/create',
        'product-adjustments.show': '/product-adjustments/{product_adjustment}',
        'product-adjustments.edit': '/product-adjustments/{product_adjustment}/edit',
        'product-adjustments.store': '/product-adjustments',
        'product-adjustments.update': '/product-adjustments/{product_adjustment}',
        'product-adjustments.destroy': '/product-adjustments/{product_adjustment}',
        'product-adjustments.approve': '/product-adjustments/{product_adjustment}/approve',
        'product-adjustments.reject': '/product-adjustments/{product_adjustment}/reject',
        'warehouses.index': '/warehouses',
        'warehouses.create': '/warehouses/create',
        'warehouses.show': '/warehouses/{warehouse}',
        'warehouses.edit': '/warehouses/{warehouse}/edit',
        'warehouses.inventory.update': '/warehouses/{warehouse}/inventory',
        'employee-stocks.index': '/employee-stocks',
        'employee-stocks.show': '/employee-stocks/{employee}',
        'employee-stocks.update': '/employee-stocks/{stock}',
        'stock-transfers.index': '/stock-transfers',
        'stock-transfers.create': '/stock-transfers/create',
        'stock-transfers.show': '/stock-transfers/{stock_transfer}',
        'stock-transfers.store': '/stock-transfers',
        'stock-transfers.approve': '/stock-transfers/{transfer}/approve',
        'stock-transfers.cancel': '/stock-transfers/{transfer}/cancel',
        'expenses.index': '/expenses',
        'expenses.create': '/expenses/create',
        'expenses.show': '/expenses/{expense}',
        'expenses.edit': '/expenses/{expense}/edit',
        'expenses.store': '/expenses',
        'expenses.update': '/expenses/{expense}',
        'expenses.destroy': '/expenses/{expense}',
        'expenses.approve': '/expenses/{expense}/approve',
        'expenses.reject': '/expenses/{expense}/reject',
        'reports.index': '/reports',
        'reports.employee-balances': '/reports/employee-balances',
        'reports.delivery-stats': '/reports/delivery-stats',
        'reports.product-performance': '/reports/product-performance',
        'reports.yearly-comparison': '/reports/yearly-comparison',
        'reports.monthly-trends': '/reports/monthly-trends',
        'reports.top-performers': '/reports/top-performers',
        'roles.index': '/roles',
        'roles.create': '/roles/create',
        'roles.show': '/roles/{role}',
        'roles.edit': '/roles/{role}/edit',
        'roles.store': '/roles',
        'roles.update': '/roles/{role}',
        'roles.destroy': '/roles/{role}',
        'permissions.index': '/permissions',
        'permissions.create': '/permissions/create',
        'permissions.show': '/permissions/{permission}',
        'permissions.edit': '/permissions/{permission}/edit',
        'permissions.store': '/permissions',
        'permissions.update': '/permissions/{permission}',
        'permissions.destroy': '/permissions/{permission}',
        'settings.index': '/settings',
        'employee-promotions.index': '/employee-promotions',
        'employee-promotions.create': '/employee-promotions/create',
        'employee-promotions.show': '/employee-promotions/{employee_promotion}',
        'employee-promotions.edit': '/employee-promotions/{employee_promotion}/edit',
        'employee-promotions.store': '/employee-promotions',
        'employee-promotions.update': '/employee-promotions/{employee_promotion}',
        'employee-promotions.destroy': '/employee-promotions/{employee_promotion}',
        'positions.index': '/positions',
        'positions.create': '/positions/create',
        'positions.show': '/positions/{position}',
        'positions.edit': '/positions/{position}/edit',
        'positions.store': '/positions',
        'positions.update': '/positions/{position}',
        'positions.destroy': '/positions/{position}',
        'departments.index': '/departments',
        'departments.create': '/departments/create',
        'departments.show': '/departments/{department}',
        'departments.edit': '/departments/{department}/edit',
        'departments.store': '/departments',
        'departments.update': '/departments/{department}',
        'departments.destroy': '/departments/{department}',
        'admin.user-permissions': '/admin/user-permissions',
        'admin.users.index': '/admin/users',
        'admin.users.create': '/admin/users/create',
        'admin.users.store': '/admin/users',
        'admin.users.show': '/admin/users/{user}',
        'admin.users.edit': '/admin/users/{user}/edit',
        'admin.users.update': '/admin/users/{user}',
        'admin.users.destroy': '/admin/users/{user}',
        'admin.users.toggle-status': '/admin/users/{user}/toggle-status',
        'admin.users.reset-password': '/admin/users/{user}/reset-password',
        'admin.users.update-permissions': '/admin/users/{user}/permissions',
        // Auth routes
        'login': '/login',
        'register': '/register',
        'password.request': '/forgot-password',
        'password.reset': '/reset-password/{token}',
        'verification.notice': '/verify-email'
    };

    let url = routes[name];

    // If route not found, return a fallback
    if (!url) {
        console.warn(`Route '${name}' not found in routes`);
        return `/${name.replace(/\./g, '/')}`;
    }

    // Handle parameter replacement
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            // Handle both {key} and key parameter formats
            url = url.replace(`{${key}}`, params[key]);
            url = url.replace(`:${key}`, params[key]);
        });
    }

    // Handle special cases for model binding
    if (params) {
        // Handle single parameter case
        if (typeof params === 'string' || typeof params === 'number') {
            // Replace the first parameter placeholder
            url = url.replace(/\{[^}]+\}/, params);
        }
    }

    return url;
};

// Add current method to route function
window.route.current = function(routeName) {
    const currentPath = window.location.pathname;

    // Exact route matches
    const exactMatches = {
        'dashboard': '/dashboard',
        'employees.index': '/employees',
        'products.index': '/products',
        'product-categories.index': '/product-categories',
        'product-units.index': '/product-units',
        'product-adjustments.index': '/product-adjustments',
        'product-deliveries.index': '/product-deliveries',
        'balance-sheets.index': '/balance-sheets',
        'warehouses.index': '/warehouses',
        'employee-stocks.index': '/employee-stocks',
        'stock-transfers.index': '/stock-transfers',
        'expenses.index': '/expenses',
        'reports.index': '/reports',
        'roles.index': '/roles',
        'permissions.index': '/permissions',
        'settings.index': '/settings',
        'employee-promotions.index': '/employee-promotions',
        'positions.index': '/positions',
        'departments.index': '/departments',
        'personal-info.index': '/personal-info',
        'admin.user-permissions': '/admin/user-permissions',
        'admin.users.index': '/admin/users'
    };

    if (exactMatches[routeName]) {
        return currentPath === exactMatches[routeName];
    }

    // Wildcard route matches
    if (routeName === 'employees.*') {
        return currentPath.startsWith('/employees');
    }

    if (routeName === 'products.*') {
        return currentPath.startsWith('/products');
    }

    if (routeName === 'product-categories.*') {
        return currentPath.startsWith('/product-categories');
    }

    if (routeName === 'product-units.*') {
        return currentPath.startsWith('/product-units');
    }

    if (routeName === 'product-adjustments.*') {
        return currentPath.startsWith('/product-adjustments');
    }

    if (routeName === 'product-deliveries.*') {
        return currentPath.startsWith('/product-deliveries');
    }

    if (routeName === 'balance-sheets.*') {
        return currentPath.startsWith('/balance-sheets');
    }

    if (routeName === 'warehouses.*') {
        return currentPath.startsWith('/warehouses');
    }

    if (routeName === 'employee-stocks.*') {
        return currentPath.startsWith('/employee-stocks');
    }

    if (routeName === 'stock-transfers.*') {
        return currentPath.startsWith('/stock-transfers');
    }

    if (routeName === 'expenses.*') {
        return currentPath.startsWith('/expenses');
    }

    if (routeName === 'reports.*') {
        return currentPath.startsWith('/reports');
    }

    if (routeName === 'roles.*') {
        return currentPath.startsWith('/roles');
    }

    if (routeName === 'permissions.*') {
        return currentPath.startsWith('/permissions');
    }

    if (routeName === 'employee-promotions.*') {
        return currentPath.startsWith('/employee-promotions');
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

    if (routeName === 'settings.*') {
        return currentPath.startsWith('/settings');
    }

    if (routeName === 'admin.*') {
        return currentPath.startsWith('/admin');
    }

    return false;
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#ffffff',
                            color: '#374151',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '16px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#ffffff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#ffffff',
                            },
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#4F46E5',
    },
});
