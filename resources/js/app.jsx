import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Set up a comprehensive route function without Ziggy
window.route = function(name, params = {}) {
    // Define all application routes
    const routes = {
        'dashboard': '/dashboard',
        'employees.index': '/employees',
        'employees.create': '/employees/create',
        'employees.show': '/employees/{id}',
        'employees.edit': '/employees/{id}/edit',
        'employees.export': '/employees/export',
        'employees.import': '/employees/import',
        'profile.edit': '/profile',
        'logout': '/logout',
        'balance-sheets.index': '/balance-sheets',
        'balance-sheets.show': '/balance-sheets/{employee}',
        'balance-sheets.update-balance': '/balance-sheets/{employee}/update-balance',
        'products.index': '/products',
        'products.create': '/products/create',
        'products.show': '/products/{id}',
        'products.edit': '/products/{id}/edit',
        'products.update-stock': '/products/{product}/update-stock',
        'product-deliveries.index': '/product-deliveries',
        'product-deliveries.create': '/product-deliveries/create',
        'product-deliveries.show': '/product-deliveries/{id}',
        'product-deliveries.edit': '/product-deliveries/{id}/edit',
        'warehouses.index': '/warehouses',
        'warehouses.create': '/warehouses/create',
        'warehouses.show': '/warehouses/{id}',
        'warehouses.edit': '/warehouses/{id}/edit',
        'expenses.index': '/expenses',
        'expenses.create': '/expenses/create',
        'expenses.show': '/expenses/{id}',
        'expenses.edit': '/expenses/{id}/edit',
        'reports.index': '/reports',
        'reports.employee-balances': '/reports/employee-balances',
        'reports.delivery-stats': '/reports/delivery-stats',
        'reports.product-performance': '/reports/product-performance',
        'reports.yearly-comparison': '/reports/yearly-comparison',
        'reports.monthly-trends': '/reports/monthly-trends',
        'reports.top-performers': '/reports/top-performers',
        'roles.index': '/roles',
        'roles.create': '/roles/create',
        'roles.show': '/roles/{id}',
        'roles.edit': '/roles/{id}/edit',
        'permissions.index': '/permissions',
        'permissions.create': '/permissions/create',
        'permissions.show': '/permissions/{id}',
        'permissions.edit': '/permissions/{id}/edit',
        'settings.index': '/settings',
        'admin.user-permissions': '/admin/user-permissions',
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
            url = url.replace(`{${key}}`, params[key]);
        });
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
        'product-deliveries.index': '/product-deliveries',
        'balance-sheets.index': '/balance-sheets',
        'warehouses.index': '/warehouses',
        'expenses.index': '/expenses',
        'reports.index': '/reports',
        'roles.index': '/roles',
        'permissions.index': '/permissions',
        'settings.index': '/settings',
        'admin.user-permissions': '/admin/user-permissions'
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

    if (routeName === 'product-deliveries.*') {
        return currentPath.startsWith('/product-deliveries');
    }

    if (routeName === 'balance-sheets.*') {
        return currentPath.startsWith('/balance-sheets');
    }

    if (routeName === 'warehouses.*') {
        return currentPath.startsWith('/warehouses');
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

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4F46E5',
    },
});
