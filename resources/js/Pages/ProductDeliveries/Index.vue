<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Product Deliveries</h2>
                        <Link :href="route('product-deliveries.create')" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Create New Delivery
                        </Link>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b">Employee</th>
                                    <th class="py-2 px-4 border-b">Product</th>
                                    <th class="py-2 px-4 border-b">Quantity</th>
                                    <th class="py-2 px-4 border-b">Total Amount</th>
                                    <th class="py-2 px-4 border-b">Status</th>
                                    <th class="py-2 px-4 border-b">Date</th>
                                    <th class="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="delivery in deliveries.data" :key="delivery.id">
                                    <td class="py-2 px-4 border-b">{{ delivery.employee.name }}</td>
                                    <td class="py-2 px-4 border-b">{{ delivery.product.name }}</td>
                                    <td class="py-2 px-4 border-b">{{ delivery.quantity }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(delivery.total_amount) }}</td>
                                    <td class="py-2 px-4 border-b">{{ delivery.status }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatDate(delivery.delivery_date) }}</td>
                                    <td class="py-2 px-4 border-b">
                                        <Link :href="route('product-deliveries.edit', delivery.id)" class="text-blue-500 hover:underline mr-2">
                                            Edit
                                        </Link>
                                        <button @click="deleteDelivery(delivery)" class="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination :links="deliveries.links" class="mt-6" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link } from '@inertiajs/inertia-vue3';
import { Inertia } from '@inertiajs/inertia';
import Pagination from '@/Components/Pagination.vue';

defineProps({
    deliveries: Object
});

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

const deleteDelivery = (delivery) => {
    if (confirm('Are you sure you want to delete this delivery?')) {
        Inertia.delete(route('product-deliveries.destroy', delivery.id));
    }
};
</script>
