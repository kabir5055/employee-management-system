import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CogIcon,
    BuildingOfficeIcon,
    GlobeAltIcon,
    EnvelopeIcon,
    ServerIcon,
    UserIcon,
    PhotoIcon,
    DocumentTextIcon,
    CheckIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function SettingsIndex({ auth, settings }) {
    const [activeTab, setActiveTab] = useState('general');
    const [previewImages, setPreviewImages] = useState({});
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        settings: []
    });

    useEffect(() => {
        // Initialize form data with current settings
        const formSettings = [];
        Object.keys(settings || {}).forEach(group => {
            settings[group].forEach(setting => {
                formSettings.push({
                    key: setting.key,
                    value: setting.value || '',
                    type: setting.type,
                    group: setting.group,
                    label: setting.label
                });
            });
        });
        setData('settings', formSettings);
    }, [settings]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'), {
            onSuccess: () => {
                // Success message is handled by flash message
            }
        });
    };

    const updateSettingValue = (key, value) => {
        setData('settings', data.settings.map(setting =>
            setting.key === key ? { ...setting, value } : setting
        ));
    };

    const handleFileChange = (key, files) => {
        if (files && files[0]) {
            const file = files[0];
            updateSettingValue(key, [file]);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImages(prev => ({
                    ...prev,
                    [key]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'general', name: 'General', icon: CogIcon },
        { id: 'company', name: 'Company', icon: BuildingOfficeIcon },
        { id: 'mail', name: 'Mail', icon: EnvelopeIcon },
        { id: 'system', name: 'System', icon: ServerIcon }
    ];

    const renderSettingField = (setting) => {
        const currentValue = data.settings.find(s => s.key === setting.key)?.value || '';

        switch (setting.type) {
            case 'text':
            case 'email':
            case 'url':
                return (
                    <input
                        type={setting.type}
                        id={setting.key}
                        value={currentValue}
                        onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={setting.label}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        id={setting.key}
                        rows={4}
                        value={currentValue}
                        onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={setting.label}
                    />
                );

            case 'select':
                let options = [];
                try {
                    // Handle both array and JSON string formats
                    if (Array.isArray(setting.options)) {
                        options = setting.options;
                    } else if (typeof setting.options === 'string') {
                        options = JSON.parse(setting.options);
                    } else if (setting.options) {
                        options = setting.options;
                    }
                } catch (error) {
                    console.error('Error parsing options for setting:', setting.key, error);
                    options = [];
                }

                return (
                    <select
                        id={setting.key}
                        value={currentValue}
                        onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select {setting.label}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'boolean':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={setting.key}
                            checked={currentValue === '1' || currentValue === true}
                            onChange={(e) => updateSettingValue(setting.key, e.target.checked ? '1' : '0')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={setting.key} className="ml-2 block text-sm text-gray-900">
                            Enable {setting.label}
                        </label>
                    </div>
                );

            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            id={setting.key}
                            onChange={(e) => handleFileChange(setting.key, e.target.files)}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            accept="image/*"
                        />
                        {(previewImages[setting.key] || currentValue) && (
                            <div className="mt-2">
                                <img
                                    src={previewImages[setting.key] || currentValue}
                                    alt="Preview"
                                    className="h-16 w-16 object-cover rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        id={setting.key}
                        value={currentValue}
                        onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={setting.label}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        id={setting.key}
                        value={currentValue}
                        onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={setting.label}
                    />
                );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-2">
                    <CogIcon className="h-6 w-6 text-gray-500" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        System Settings
                    </h2>
                </div>
            }
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex">
                                <CheckIcon className="h-5 w-5 text-green-400" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        {flash.success}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">
                                        {flash.error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`${
                                                activeTab === tab.id
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                {Object.keys(settings || {}).map(group => {
                                    if (group !== activeTab) return null;

                                    return (
                                        <div key={group} className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                {settings[group].map((setting) => (
                                                    <div key={setting.key}>
                                                        <label
                                                            htmlFor={setting.key}
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            {setting.label}
                                                        </label>
                                                        {renderSettingField(setting)}
                                                        {errors[`settings.${setting.key}`] && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {errors[`settings.${setting.key}`]}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Default message if no settings for active tab */}
                                {(!settings || !settings[activeTab] || settings[activeTab].length === 0) && (
                                    <div className="text-center py-12">
                                        <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            No settings configured
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Settings for the {activeTab} section have not been configured yet.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
