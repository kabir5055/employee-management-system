<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Edit Product Delivery</h2>
                    </div>

                    <form @submit.prevent="form.patch(route('product-deliveries.update', delivery.id))">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="quantity">
                                    Quantity
                                </label>
                                <input
                                    v-model="form.quantity"
                                    type="number"
                                    min="1"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="unit_price">
                                    Unit Price
                                </label>
                                <input
                                    v-model="form.unit_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="delivery_date">
                                    Delivery Date
                                </label>
                                <input
                                    v-model="form.delivery_date"
                                    type="date"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
                                    Status
                                </label>
                                <select
                                    v-model="form.status"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="notes">
                                    Notes
                                </label>
                                <textarea
                                    v-model="form.notes"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                ></textarea>
                            </div>
                        </div>

                        <div class="flex items-center justify-end mt-6">
                            <Link
                                :href="route('product-deliveries.index')"
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                class="bg-blue-500 text-white px-4 py-2 rounded-md"
                                :disabled="form.processing"
                            >
                                Update Delivery
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/inertia-vue3';

const props = defineProps({
    delivery: Object
});

const form = useForm({
    quantity: props.delivery.quantity,
    unit_price: props.delivery.unit_price,
    delivery_date: props.delivery.delivery_date,
    status: props.delivery.status,
    notes: props.delivery.notes
});
</script>
