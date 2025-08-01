import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    EyeIcon,
    EyeSlashIcon,
    UserIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { settings } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const appName = settings?.app_name || 'Employee Management System';
    const companyName = settings?.company_name || 'Your Company';
    const appLogo = settings?.app_logo;

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
                <div className="flex min-h-screen">
                    {/* Left side - Login Form */}
                    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <div className="text-center mb-8">
                                {appLogo ? (
                                    <img
                                        className="mx-auto h-16 w-auto"
                                        src={appLogo}
                                        alt={appName}
                                    />
                                ) : (
                                    <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-xl flex items-center justify-center">
                                        <BuildingOfficeIcon className="h-8 w-8 text-white" />
                                    </div>
                                )}

                                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                                    Welcome Back
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Sign in to your {appName} account
                                </p>
                            </div>

                            {status && (
                                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                                    <div className="flex">
                                        <ShieldCheckIcon className="h-5 w-5 text-green-400" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">
                                                {status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={submit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter your password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember"
                                            name="remember"
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>

                                    {canResetPassword && (
                                        <div className="text-sm">
                                            <Link
                                                href={route('password.request')}
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            {processing ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                            ) : (
                                                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                                            )}
                                        </span>
                                        {processing ? 'Signing in...' : 'Sign in'}
                                        {!processing && (
                                            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <Link
                                            href={route('register')}
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right side - Background */}
                    <div className="hidden lg:block relative w-0 flex-1">
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 to-purple-700">
                            <div className="flex flex-col justify-center items-center h-full text-white p-12">
                                <div className="h-24 w-24 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                                    <BuildingOfficeIcon className="h-12 w-12 text-white" />
                                </div>

                                <h1 className="text-4xl font-bold text-center mb-4">
                                    {companyName}
                                </h1>
                                <p className="text-xl text-center mb-8 text-indigo-100">
                                    Streamline your workforce management
                                </p>

                                <div className="space-y-4 text-left">
                                    <div className="flex items-center space-x-3">
                                        <svg className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg">Employee Management</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg">Payroll Processing</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg">Attendance Tracking</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <svg className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-lg">Comprehensive Reports</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
