<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Employee Balance Report</h2>
                        <Link :href="route('reports.index')" class="text-blue-500 hover:underline">
                            Back to Reports
                        </Link>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b">Employee Name</th>
                                    <th class="py-2 px-4 border-b">Current Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="balance in balances" :key="balance.employee_name">
                                    <td class="py-2 px-4 border-b">{{ balance.employee_name }}</td>
                                    <td class="py-2 px-4 border-b" :class="{
                                        'text-green-600': balance.balance >= 0,
                                        'text-red-600': balance.balance < 0
                                    }">
                                        {{ formatCurrency(balance.balance) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-6">
                        <h3 class="text-lg font-semibold mb-4">Summary</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <p class="text-sm text-gray-600">Total Employees</p>
                                <p class="text-2xl font-bold">{{ balances.length }}</p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <p class="text-sm text-gray-600">Average Balance</p>
                                <p class="text-2xl font-bold">{{ formatCurrency(averageBalance) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3';
import { computed } from 'vue';

const props = defineProps({
    balances: Array
});

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const averageBalance = computed(() => {
    if (!props.balances.length) return 0;
    const total = props.balances.reduce((sum, balance) => sum + balance.balance, 0);
    return total / props.balances.length;
});
</script>
