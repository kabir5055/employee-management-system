import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    UserIcon,
    ShieldCheckIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function UserPermissions({ auth, users, roles, permissions }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        roles: [],
        permissions: []
    });

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setData({
            roles: user.roles?.map(role => role.id) || [],
            permissions: user.permissions?.map(permission => permission.id) || []
        });
        setIsEditing(false);
    };

    const handleRoleChange = (roleId) => {
        const newRoles = data.roles.includes(roleId)
            ? data.roles.filter(id => id !== roleId)
            : [...data.roles, roleId];
        setData('roles', newRoles);
    };

    const handlePermissionChange = (permissionId) => {
        const newPermissions = data.permissions.includes(permissionId)
            ? data.permissions.filter(id => id !== permissionId)
            : [...data.permissions, permissionId];
        setData('permissions', newPermissions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update-permissions', selectedUser.id), {
            onSuccess: () => {
                setIsEditing(false);
                // Refresh user data
                setSelectedUser(prev => ({
                    ...prev,
                    roles: roles.filter(role => data.roles.includes(role.id)),
                    permissions: permissions.filter(permission => data.permissions.includes(permission.id))
                }));
            }
        });
    };

    const groupedPermissions = permissions.reduce((acc, permission) => {
        const category = permission.name.split('-')[1] || 'general';
        if (!acc[category]) acc[category] = [];
        acc[category].push(permission);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-6 w-6 text-gray-500" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        User Role & Permission Management
                    </h2>
                </div>
            }
        >
            <Head title="User Permissions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Users List */}
                                <div className="lg:col-span-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Users</h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleUserSelect(user)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    selectedUser?.id === user.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <div className="font-medium text-sm">{user.name}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                        <div className="text-xs text-gray-400">
                                                            {user.roles?.map(role => role.name).join(', ') || 'No roles'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* User Details & Permissions */}
                                <div className="lg:col-span-2">
                                    {selectedUser ? (
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {selectedUser.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <PencilIcon className="h-4 w-4 mr-2" />
                                                    {isEditing ? 'Cancel' : 'Edit'}
                                                </button>
                                            </div>

                                            {isEditing ? (
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    {/* Roles Section */}
                                                    <div>
                                                        <h4 className="text-md font-medium text-gray-900 mb-3">Roles</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {roles.map((role) => (
                                                                <label key={role.id} className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={data.roles.includes(role.id)}
                                                                        onChange={() => handleRoleChange(role.id)}
                                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                                                                    />
                                                                    <span className="text-sm text-gray-700 capitalize">
                                                                        {role.name.replace('-', ' ')}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Permissions Section */}
                                                    <div>
                                                        <h4 className="text-md font-medium text-gray-900 mb-3">Direct Permissions</h4>
                                                        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                                            <div key={category} className="mb-4">
                                                                <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                                                                    {category.replace('-', ' ')}
                                                                </h5>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                    {categoryPermissions.map((permission) => (
                                                                        <label key={permission.id} className="flex items-center space-x-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={data.permissions.includes(permission.id)}
                                                                                onChange={() => handlePermissionChange(permission.id)}
                                                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                                                                            />
                                                                            <span className="text-xs text-gray-600">
                                                                                {permission.name.replace('-', ' ')}
                                                                            </span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditing(false)}
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={processing}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                        >
                                                            <CheckIcon className="h-4 w-4 mr-2" />
                                                            {processing ? 'Saving...' : 'Save Changes'}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="space-y-6">
                                                    {/* Current Roles */}
                                                    <div>
                                                        <h4 className="text-md font-medium text-gray-900 mb-3">Current Roles</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedUser.roles?.length > 0 ? (
                                                                selectedUser.roles.map((role) => (
                                                                    <span
                                                                        key={role.id}
                                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                                    >
                                                                        {role.name.replace('-', ' ')}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-500">No roles assigned</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Current Permissions */}
                                                    <div>
                                                        <h4 className="text-md font-medium text-gray-900 mb-3">Effective Permissions</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                            {selectedUser.all_permissions?.length > 0 ? (
                                                                selectedUser.all_permissions.map((permission) => (
                                                                    <span
                                                                        key={permission.id}
                                                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                                                                    >
                                                                        {permission.name.replace('-', ' ')}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-500">No permissions</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No user selected</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Select a user from the left to view and manage their permissions.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
