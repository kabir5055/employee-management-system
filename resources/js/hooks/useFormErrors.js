import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

export function useFormErrors() {
    const { errors } = usePage().props;

    useEffect(() => {
        // Handle validation errors
        if (errors && Object.keys(errors).length > 0) {
            // Show first error as toast
            const firstError = Object.values(errors)[0];
            if (Array.isArray(firstError)) {
                toast.error(firstError[0]);
            } else {
                toast.error(firstError);
            }
        }
    }, [errors]);

    return errors;
}
