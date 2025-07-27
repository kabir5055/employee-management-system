<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Create Product Delivery</h2>
                    </div>

                    <form @submit.prevent="form.post(route('product-deliveries.store'))">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="employee_id">
                                    Employee
                                </label>
                                <select
                                    v-model="form.employee_id"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="" disabled>Select Employee</option>
                                    <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                                        {{ employee.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="product_id">
                                    Product
                                </label>
                                <select
                                    v-model="form.product_id"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="" disabled>Select Product</option>
                                    <option v-for="product in products" :key="product.id" :value="product.id">
                                        {{ product.name }}
                                    </option>
                                </select>
                            </div>

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
                                Create Delivery
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
    employees: Array,
    products: Array
});

const form = useForm({
    employee_id: '',
    product_id: '',
    quantity: '',
    unit_price: '',
    delivery_date: '',
    notes: ''
});
</script>
