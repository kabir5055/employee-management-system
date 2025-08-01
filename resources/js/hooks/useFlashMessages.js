import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

export function useFlashMessages() {
    const { flash } = usePage().props;

    useEffect(() => {
        // Handle success messages
        if (flash?.success) {
            toast.success(flash.success);
        }

        // Handle error messages
        if (flash?.error) {
            toast.error(flash.error);
        }

        // Handle warning messages
        if (flash?.warning) {
            toast(flash.warning, {
                icon: '⚠️',
                style: {
                    background: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fcd34d',
                },
            });
        }

        // Handle info messages
        if (flash?.info) {
            toast(flash.info, {
                icon: '📝',
                style: {
                    background: '#dbeafe',
                    color: '#1e40af',
                    border: '1px solid #60a5fa',
                },
            });
        }
    }, [flash]);

    return null;
}
