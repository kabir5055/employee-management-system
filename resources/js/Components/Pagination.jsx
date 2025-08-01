import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ links, className = '' }) {
    if (!links || links.length <= 3) {
        return null; // No pagination needed if there are only prev, numbers, and next
    }

    return (
        <nav className={`flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 ${className}`}>
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0].url ? (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
                        Previous
                    </span>
                )}

                {links[links.length - 1].url ? (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
                        Next
                    </span>
                )}
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    {/* You can add result count info here if needed */}
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {links.map((link, index) => {
                            if (index === 0) {
                                // Previous button
                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                );
                            }

                            if (index === links.length - 1) {
                                // Next button
                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed"
                                    >
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                );
                            }

                            // Number buttons
                            if (link.active) {
                                return (
                                    <span
                                        key={index}
                                        className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {link.label}
                                    </span>
                                );
                            }

                            if (link.url) {
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        {link.label}
                                    </Link>
                                );
                            } else {
                                return (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300"
                                    >
                                        {link.label}
                                    </span>
                                );
                            }
                        })}
                    </nav>
                </div>
            </div>
        </nav>
    );
}
