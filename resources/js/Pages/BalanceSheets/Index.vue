<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Balance Sheets</h2>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b">Employee</th>
                                    <th class="py-2 px-4 border-b">Opening Balance</th>
                                    <th class="py-2 px-4 border-b">Current Balance</th>
                                    <th class="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="sheet in balanceSheets.data" :key="sheet.id">
                                    <td class="py-2 px-4 border-b">{{ sheet.employee.name }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(sheet.opening_balance) }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(sheet.current_balance) }}</td>
                                    <td class="py-2 px-4 border-b">
                                        <Link :href="route('balance-sheets.show', sheet.employee_id)" class="text-blue-500 hover:underline">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination :links="balanceSheets.links" class="mt-6" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3';
import Pagination from '@/Components/Pagination.vue';

defineProps({
    balanceSheets: Object
});

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};
</script>
