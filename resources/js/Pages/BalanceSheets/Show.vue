<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Balance Sheet Details</h2>
                        <div class="space-x-4">
                            <button @click="showUpdateBalanceModal = true" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                                Update Balance
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="text-lg font-semibold mb-2">Employee Details</h3>
                            <p><span class="font-medium">Name:</span> {{ balanceSheet.employee.name }}</p>
                            <p><span class="font-medium">Opening Balance:</span> {{ formatCurrency(balanceSheet.opening_balance) }}</p>
                            <p><span class="font-medium">Current Balance:</span> {{ formatCurrency(balanceSheet.current_balance) }}</p>
                        </div>
                    </div>

                    <h3 class="text-xl font-semibold mb-4">Product Deliveries</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b">Product</th>
                                    <th class="py-2 px-4 border-b">Quantity</th>
                                    <th class="py-2 px-4 border-b">Unit Price</th>
                                    <th class="py-2 px-4 border-b">Total Amount</th>
                                    <th class="py-2 px-4 border-b">Status</th>
                                    <th class="py-2 px-4 border-b">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="delivery in deliveries.data" :key="delivery.id">
                                    <td class="py-2 px-4 border-b">{{ delivery.product.name }}</td>
                                    <td class="py-2 px-4 border-b">{{ delivery.quantity }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(delivery.unit_price) }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(delivery.total_amount) }}</td>
                                    <td class="py-2 px-4 border-b">{{ delivery.status }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatDate(delivery.delivery_date) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination :links="deliveries.links" class="mt-6" />

                    <!-- Update Balance Modal -->
                    <Modal :show="showUpdateBalanceModal" @close="showUpdateBalanceModal = false">
                        <div class="p-6">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Update Balance</h3>
                            <form @submit.prevent="updateBalance">
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700" for="type">
                                        Type
                                    </label>
                                    <select v-model="form.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700" for="amount">
                                        Amount
                                    </label>
                                    <input
                                        v-model="form.amount"
                                        type="number"
                                        step="0.01"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                </div>

                                <div class="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        @click="showUpdateBalanceModal = false"
                                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        class="bg-blue-500 text-white px-4 py-2 rounded-md"
                                        :disabled="form.processing"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Link, useForm } from '@inertiajs/inertia-vue3';
import Pagination from '@/Components/Pagination.vue';
import Modal from '@/Components/Modal.vue';

const props = defineProps({
    balanceSheet: Object,
    deliveries: Object
});

const showUpdateBalanceModal = ref(false);

const form = useForm({
    type: 'credit',
    amount: ''
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

const updateBalance = () => {
    form.post(route('balance-sheets.update-balance', props.balanceSheet.employee_id), {
        onSuccess: () => {
            showUpdateBalanceModal.value = false;
            form.reset();
        }
    });
};
</script>
