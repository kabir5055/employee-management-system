<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Sidebar -->
        <aside :class="[
            'fixed inset-y-0 z-50 flex-wrap items-center justify-between block w-full p-0 antialiased transition-transform duration-200 bg-white border-0 shadow-xl lg:left-0 lg:translate-x-0 lg:block lg:fixed lg:top-0 lg:bottom-0 lg:max-w-64',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <div class="h-full px-4 py-6">
                <!-- Logo -->
                <div class="flex items-center justify-between mb-8">
                    <Link :href="route('dashboard')" class="flex items-center">
                        <img v-if="$page.props.settings?.app_logo"
                            :src="$page.props.settings.app_logo"
                            class="h-8 w-auto mr-3"
                            :alt="$page.props.settings?.app_name" />
                        <ApplicationLogo v-else class="block h-8 w-auto fill-current text-gray-800" />
                        <span class="ml-3 text-xl font-semibold">
                            {{ $page.props.settings?.app_name || 'EMS' }}
                        </span>
                    </Link>
                    <button @click="toggleSidebar" class="lg:hidden">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Navigation -->
                <nav class="space-y-1">
                    <Link :href="route('dashboard')"
                        class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                        :class="[
                            route().current('dashboard')
                                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <HomeIcon class="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>

                    <Link :href="route('employees.index')"
                        class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                        :class="[
                            route().current('employees.*')
                                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <UsersIcon class="w-5 h-5 mr-3" />
                        Employees
                    </Link>

                    <Link :href="route('products.index')"
                        class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                        :class="[
                            route().current('products.*')
                                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <CubeIcon class="w-5 h-5 mr-3" />
                        Products
                    </Link>

                    <Link :href="route('product-deliveries.index')"
                        class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                        :class="[
                            route().current('product-deliveries.*')
                                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <TruckIcon class="w-5 h-5 mr-3" />
                        Deliveries
                    </Link>

                    <Link :href="route('balance-sheets.index')"
                        class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                        :class="[
                            route().current('balance-sheets.*')
                                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        ]">
                        <BanknotesIcon class="w-5 h-5 mr-3" />
                        Balance Sheets
                    </Link>

                    <template v-if="$page.props.auth.user.roles.includes('super-admin') || $page.props.auth.user.roles.includes('admin')">
                        <Link :href="route('roles.index')"
                            class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                            :class="[
                                route().current('roles.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            ]">
                            <KeyIcon class="w-5 h-5 mr-3" />
                            Roles
                        </Link>

                        <Link :href="route('permissions.index')"
                            class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                            :class="[
                                route().current('permissions.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            ]">
                            <LockClosedIcon class="w-5 h-5 mr-3" />
                            Permissions
                        </Link>

                        <Link :href="route('settings.index')"
                            class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                            :class="[
                                route().current('settings.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            ]">
                            <Cog6ToothIcon class="w-5 h-5 mr-3" />
                            Settings
                        </Link>
                    </template>

                    <template v-if="['super-admin', 'admin', 'manager'].some(role => $page.props.auth.user.roles.includes(role))">
                        <Link :href="route('reports.index')"
                            class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-lg"
                            :class="[
                                route().current('reports.*')
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            ]">
                            <ChartBarIcon class="w-5 h-5 mr-3" />
                            Reports
                        </Link>
                    </template>
                </nav>

                <!-- User Menu -->
                <div class="absolute bottom-0 left-0 right-0 p-4">
                    <Menu as="div" class="relative">
                        <MenuButton class="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                            <img v-if="$page.props.auth.user.profile_photo_url"
                                :src="$page.props.auth.user.profile_photo_url"
                                class="w-8 h-8 mr-3 rounded-full"
                                :alt="$page.props.auth.user.name" />
                            <div class="flex-1 text-left">
                                <p class="font-medium">{{ $page.props.auth.user.name }}</p>
                                <p class="text-xs text-gray-500">{{ $page.props.auth.user.email }}</p>
                            </div>
                            <ChevronUpDownIcon class="w-5 h-5 ml-2" />
                        </MenuButton>

                        <transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0"
                        >
                            <MenuItems class="absolute bottom-full left-0 right-0 mb-2 origin-bottom-right bg-white rounded-lg shadow-lg">
                                <div class="py-1">
                                    <MenuItem v-slot="{ active }">
                                        <Link :href="route('profile.edit')"
                                            :class="[
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            ]">
                                            Profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                        <Link :href="route('logout')"
                                            method="post"
                                            as="button"
                                            class="w-full text-left"
                                            :class="[
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            ]">
                                            Log Out
                                        </Link>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </transition>
                    </Menu>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <div :class="[
            'flex flex-col min-h-screen transition-all duration-200',
            sidebarOpen ? 'lg:ml-64' : ''
        ]">
            <!-- Top Bar -->
            <header class="relative z-40 bg-white shadow-sm">
                <div class="flex items-center justify-between px-4 py-4 lg:px-6">
                    <!-- Mobile Menu Button -->
                    <button @click="toggleSidebar" class="lg:hidden">
                        <Bars3Icon class="w-6 h-6" />
                    </button>

                    <!-- Search (optional) -->
                    <div class="flex-1 hidden px-4 lg:block">
                        <!-- Add search functionality if needed -->
                    </div>

                    <!-- Right Navigation -->
                    <div class="flex items-center">
                        <!-- Add notifications, etc. if needed -->
                    </div>
                </div>
            </header>

            <!-- Page Heading -->
            <header v-if="$slots.header" class="bg-white shadow">
                <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <slot name="header" />
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import {
    HomeIcon,
    UsersIcon,
    CubeIcon,
    TruckIcon,
    BanknotesIcon,
    KeyIcon,
    LockClosedIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronUpDownIcon,
} from '@heroicons/vue/24/outline';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';

const sidebarOpen = ref(true);

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};
</script>
