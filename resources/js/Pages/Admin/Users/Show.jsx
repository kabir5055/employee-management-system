import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Avatar from '@/Components/Avatar';
import StatusBadge, { RoleBadge } from '@/Components/StatusBadge';
import UserDataFields from '@/Components/UserDataFields';
import UserStatistics from '@/Components/UserStatistics';
import AccountInformation from '@/Components/AccountInformation';
import {
    ArrowLeftIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function Show({ user, stats }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.users.index')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                {user.name}
                            </h2>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>
                    <Link
                        href={route('admin.users.edit', { user: user.id })}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <PencilSquareIcon className="w-4 h-4 mr-2" />
                        Edit User
                    </Link>
                </div>
            }
        >
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="text-center">
                                        <div className="flex justify-center mb-4">
                                            <Avatar
                                                user={user}
                                                size="xl"
                                                fallbackType="initials"
                                                showOnlineStatus={user.status === 'active'}
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>

                                        <div className="mt-4 flex items-center justify-center gap-4">
                                            <StatusBadge
                                                status={user.status}
                                                type="user"
                                                size="md"
                                            />

                                            {user.is_super_admin && (
                                                <RoleBadge role="super_admin" size="md" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <UserDataFields user={user} layout="vertical" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="lg:col-span-2">
                            <UserStatistics stats={stats} user={user} />

                            {/* Account Information */}
                            <div className="mt-6">
                                <AccountInformation user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
