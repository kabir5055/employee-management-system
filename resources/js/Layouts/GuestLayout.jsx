import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/useFlashMessages';
import { useFormErrors } from '@/hooks/useFormErrors';

export default function GuestLayout({ children }) {
    // Handle flash messages with toasts
    useFlashMessages();

    // Handle form validation errors with toasts
    useFormErrors();

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
