<template>
    <AppLayout title="Dashboard">
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Dashboard
            </h2>
        </template>

        <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <!-- Stats Cards -->
            <div class="p-4 bg-white rounded-lg shadow-xs">
                <div class="flex items-center">
                    <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
                        <UsersIcon class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="mb-2 text-sm font-medium text-gray-600">
                            Total Employees
                        </p>
                        <p class="text-lg font-semibold text-gray-700">
                            {{ stats.totalEmployees }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-xs">
                <div class="flex items-center">
                    <div class="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                        <CubeIcon class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="mb-2 text-sm font-medium text-gray-600">
                            Total Products
                        </p>
                        <p class="text-lg font-semibold text-gray-700">
                            {{ stats.totalProducts }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-xs">
                <div class="flex items-center">
                    <div class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                        <TruckIcon class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="mb-2 text-sm font-medium text-gray-600">
                            Total Deliveries
                        </p>
                        <p class="text-lg font-semibold text-gray-700">
                            {{ stats.totalDeliveries }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-xs">
                <div class="flex items-center">
                    <div class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full">
                        <BanknotesIcon class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="mb-2 text-sm font-medium text-gray-600">
                            Total Revenue
                        </p>
                        <p class="text-lg font-semibold text-gray-700">
                            ${{ stats.totalRevenue.toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-6 mb-8 md:grid-cols-2">
            <!-- Sales Chart -->
            <div class="p-4 bg-white rounded-lg shadow-xs">
                <h4 class="mb-4 font-semibold text-gray-800">
                    Monthly Sales
                </h4>
                <Line
                    :data="monthlySalesChart.data"
                    :options="monthlySalesChart.options"
                />
            </div>

            <!-- Product Performance -->
            <div class="p-4 bg-white rounded-lg shadow-xs">
                <h4 class="mb-4 font-semibold text-gray-800">
                    Top Products
                </h4>
                <Bar
                    :data="topProductsChart.data"
                    :options="topProductsChart.options"
                />
            </div>
        </div>

        <div class="grid gap-6 mb-8 md:grid-cols-2">
            <!-- Recent Deliveries -->
            <div class="p-4 bg-white rounded-lg shadow-xs">
                <h4 class="mb-4 font-semibold text-gray-800">
                    Recent Deliveries
                </h4>
                <div class="overflow-hidden">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Product
                                </th>
                                <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Employee
                                </th>
                                <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Date
                                </th>
                                <th class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="delivery in recentDeliveries" :key="delivery.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ delivery.product_name }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ delivery.employee_name }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ delivery.date }}
                                </td>
                                <td class="px-6 py-4 text-right whitespace-nowrap">
                                    ${{ delivery.amount.toLocaleString() }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Top Performers -->
            <div class="p-4 bg-white rounded-lg shadow-xs">
                <h4 class="mb-4 font-semibold text-gray-800">
                    Top Performing Employees
                </h4>
                <div class="space-y-4">
                    <div v-for="employee in topEmployees" :key="employee.id"
                        class="flex items-center p-4 bg-gray-50 rounded-lg">
                        <img :src="employee.profile_photo_url"
                            :alt="employee.name"
                            class="w-10 h-10 rounded-full" />
                        <div class="ml-4 flex-1">
                            <p class="text-sm font-medium text-gray-900">
                                {{ employee.name }}
                            </p>
                            <p class="text-sm text-gray-500">
                                {{ employee.deliveries_count }} deliveries
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">
                                ${{ employee.total_amount.toLocaleString() }}
                            </p>
                            <p class="text-xs text-gray-500">
                                Total Revenue
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import { UsersIcon, CubeIcon, TruckIcon, BanknotesIcon } from '@heroicons/vue/24/outline';
import { Line, Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const props = defineProps({
    stats: {
        type: Object,
        required: true
    },
    monthlySalesData: {
        type: Object,
        required: true
    },
    topProductsData: {
        type: Object,
        required: true
    },
    recentDeliveries: {
        type: Array,
        required: true
    },
    topEmployees: {
        type: Array,
        required: true
    }
});

const monthlySalesChart = {
    data: {
        labels: props.monthlySalesData.labels,
        datasets: [{
            label: 'Sales',
            data: props.monthlySalesData.values,
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

const topProductsChart = {
    data: {
        labels: props.topProductsData.labels,
        datasets: [{
            label: 'Sales',
            data: props.topProductsData.values,
            backgroundColor: '#4F46E5',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};
</script>
