import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Import Ziggy route helper
import { Ziggy } from './ziggy';

// Set up route helper globally
window.Ziggy = {
    ...Ziggy,
    url: window.location.origin
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
        'settings.index': '/settings',
        'admin.user-permissions': '/admin/user-permissions',
        'admin.users.update-permissions': '/admin/users/{user}/permissions'
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
window.route.current = function(routeName) {
    const currentPath = window.location.pathname;
    
    if (routeName === 'dashboard') {
        return currentPath === '/dashboard';
    }
    
    if (routeName === 'employees.*') {
        return currentPath.startsWith('/employees');
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
