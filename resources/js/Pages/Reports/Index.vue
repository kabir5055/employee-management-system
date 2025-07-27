<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h2 class="text-2xl font-semibold mb-6">Reports</h2>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            :href="route('reports.employee-balances')"
                            class="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50"
                        >
                            <h3 class="text-xl font-semibold mb-2">Employee Balances</h3>
                            <p class="text-gray-600">View current balance sheet status for all employees</p>
                        </Link>

                        <Link
                            :href="route('reports.delivery-stats')"
                            class="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50"
                        >
                            <h3 class="text-xl font-semibold mb-2">Delivery Statistics</h3>
                            <p class="text-gray-600">Analyze delivery performance by employee</p>
                        </Link>

                        <Link
                            :href="route('reports.product-performance')"
                            class="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50"
                        >
                            <h3 class="text-xl font-semibold mb-2">Product Performance</h3>
                            <p class="text-gray-600">Track product delivery metrics and trends</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3';
</script>
