import toast from 'react-hot-toast';

export const showToast = {
    success: (message) => {
        toast.success(message, {
            duration: 4000,
            style: {
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
            },
        });
    },

    error: (message) => {
        toast.error(message, {
            duration: 5000,
            style: {
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
            },
        });
    },

    warning: (message) => {
        toast(message, {
            icon: '⚠️',
            duration: 4000,
            style: {
                background: '#fffbeb',
                color: '#d97706',
                border: '1px solid #fed7aa',
            },
        });
    },

    info: (message) => {
        toast(message, {
            icon: 'ℹ️',
            duration: 4000,
            style: {
                background: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
            },
        });
    },

    loading: (message) => {
        return toast.loading(message, {
            style: {
                background: '#f9fafb',
                color: '#374151',
                border: '1px solid #d1d5db',
            },
        });
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    // Specialized CRUD operation toasts
    created: (entity) => {
        showToast.success(`${entity} created successfully!`);
    },

    updated: (entity) => {
        showToast.success(`${entity} updated successfully!`);
    },

    deleted: (entity) => {
        showToast.success(`${entity} deleted successfully!`);
    },

    // Operation confirmation toasts
    confirmDelete: (entity, onConfirm) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="font-medium">Delete {entity}?</p>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
                <div className="flex gap-2 mt-2">
                    <button
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
            },
        });
    },
};
