<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Delivery Statistics Report</h2>
                        <Link :href="route('reports.index')" class="text-blue-500 hover:underline">
                            Back to Reports
                        </Link>
                    </div>

                    <div class="mb-6">
                        <form @submit.prevent="filterStats" class="flex gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="start_date">
                                    Start Date
                                </label>
                                <input
                                    v-model="form.start_date"
                                    type="date"
                                    id="start_date"
                                    class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="end_date">
                                    End Date
                                </label>
                                <input
                                    v-model="form.end_date"
                                    type="date"
                                    id="end_date"
                                    class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                            </div>
                            <div class="flex items-end">
                                <button
                                    type="submit"
                                    class="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Filter
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b">Employee Name</th>
                                    <th class="py-2 px-4 border-b">Total Deliveries</th>
                                    <th class="py-2 px-4 border-b">Total Amount</th>
                                    <th class="py-2 px-4 border-b">Average Per Delivery</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stat in stats" :key="stat.employee_name">
                                    <td class="py-2 px-4 border-b">{{ stat.employee_name }}</td>
                                    <td class="py-2 px-4 border-b">{{ stat.total_deliveries }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(stat.total_amount) }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(stat.total_amount / stat.total_deliveries) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-6">
                        <h3 class="text-lg font-semibold mb-4">Summary</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <p class="text-sm text-gray-600">Total Employees</p>
                                <p class="text-2xl font-bold">{{ stats.length }}</p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <p class="text-sm text-gray-600">Total Deliveries</p>
                                <p class="text-2xl font-bold">{{ totalDeliveries }}</p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <p class="text-sm text-gray-600">Total Amount</p>
                                <p class="text-2xl font-bold">{{ formatCurrency(totalAmount) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/inertia-vue3';
import { computed } from 'vue';

const props = defineProps({
    stats: Array,
    startDate: String,
    endDate: String
});

const form = useForm({
    start_date: props.startDate,
    end_date: props.endDate
});

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const totalDeliveries = computed(() => {
    return props.stats.reduce((sum, stat) => sum + stat.total_deliveries, 0);
});

const totalAmount = computed(() => {
    return props.stats.reduce((sum, stat) => sum + stat.total_amount, 0);
});

const filterStats = () => {
    form.get(route('reports.delivery-stats'), {
        preserveState: true
    });
};
</script>
