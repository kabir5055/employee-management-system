import './bootstrap';
import '../css/app.css';

// Import Ziggy route helper
import { Ziggy } from './ziggy';

// Set up route helper globally with correct base URL
window.Ziggy = {
    ...Ziggy,
    url: window.location.origin // Use current origin instead of hardcoded localhost
};

// Set up a comprehensive route function
window.route = function(name, params = {}) {
    // First try to use Ziggy routes if available
    if (window.Ziggy && window.Ziggy.routes && window.Ziggy.routes[name]) {
        const route = window.Ziggy.routes[name];
        let url = window.Ziggy.url + '/' + route.uri;

        // Replace parameters if any
        if (route.parameters && params) {
            route.parameters.forEach(param => {
                if (params[param]) {
                    url = url.replace(`{${param}}`, params[param]);
                }
            });
        }
        return url;
    }

    // Fallback for common routes
    const fallbackRoutes = {
        'dashboard': '/dashboard',
        'employees.index': '/employees',
        'employees.create': '/employees/create',
        'employees.edit': '/employees/{id}/edit',
        'login': '/login',
        'register': '/register'
    };

    if (fallbackRoutes[name]) {
        let url = fallbackRoutes[name];
        if (params.id) {
            url = url.replace('{id}', params.id);
        }
        return url;
    }

    return '#';
};

// Add current method to route function
window.route.current = function(routeName) {
    const currentPath = window.location.pathname;
    
    if (routeName === 'dashboard') {
        return currentPath === '/dashboard';
    }
    
    if (routeName === 'employees.*') {
        return currentPath.startsWith('/employees');
    }
    
    // Add more route patterns as needed
    return false;
};

    // Fallback routes for development
    const fallbackRoutes = {
        'dashboard': '/dashboard',
        'employees.index': '/employees',
        'employees.create': '/employees/create',
        'employees.show': '/employees/{id}',
        'employees.edit': '/employees/{id}/edit',
        'profile.edit': '/profile',
        'logout': '/logout',
        'balance-sheets.index': '/balance-sheets',
        'employee-stocks.index': '/employee-stocks',
        'products.index': '/products',
        'product-deliveries.index': '/product-deliveries',
        'warehouses.index': '/warehouses',
        'stock-transfers.index': '/stock-transfers',
        'admin.roles.index': '/admin/roles',
        'admin.users.roles': '/admin/users/roles',
        'admin.user.permissions.index': '/admin/user-permissions',
        'admin.user.permissions.show': '/admin/user-permissions/{user}',
        'admin.user.permissions.update': '/admin/user-permissions/{user}',
        'admin.user.permissions.give-all': '/admin/user-permissions/{user}/give-all',
        'admin.user.permissions.remove-all': '/admin/user-permissions/{user}/remove-all',
        'admin.user.permissions.assign-role': '/admin/user-permissions/{user}/assign-role',
        'permissions.index': '/permissions',
        'settings.index': '/settings'
    };

    let url = fallbackRoutes[name] || '/';

    // Handle parameter replacement for fallback routes
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, params[key]);
        });
    }

    return url;
};

// Add current method to route function
window.route.current = function(pattern) {
    const currentPath = window.location.pathname;
    if (pattern.includes('*')) {
        const basePattern = pattern.replace('.*', '').replace('.', '/');
        return currentPath.startsWith('/' + basePattern);
    }
    const routePath = '/' + pattern.replace('.', '/');
    return currentPath === routePath;
};

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
