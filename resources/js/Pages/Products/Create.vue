<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Create Product</h2>
                    </div>

                    <form @submit.prevent="form.post(route('products.store'))">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                                    Name
                                </label>
                                <input
                                    v-model="form.name"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    required
                                >
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="sku">
                                    SKU
                                </label>
                                <input
                                    v-model="form.sku"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="sku"
                                    type="text"
                                    required
                                >
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
                                    Price
                                </label>
                                <input
                                    v-model="form.price"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                >
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="cost_price">
                                    Cost Price
                                </label>
                                <input
                                    v-model="form.cost_price"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cost_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                >
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="stock_quantity">
                                    Stock Quantity
                                </label>
                                <input
                                    v-model="form.stock_quantity"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="stock_quantity"
                                    type="number"
                                    min="0"
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
                                    id="status"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div class="mb-4 col-span-2">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
                                    Description
                                </label>
                                <textarea
                                    v-model="form.description"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="description"
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>

                        <div class="flex items-center justify-end mt-6">
                            <Link
                                :href="route('products.index')"
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                class="bg-blue-500 text-white px-4 py-2 rounded-md"
                                :disabled="form.processing"
                            >
                                Create Product
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

const form = useForm({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    stock_quantity: '',
    sku: '',
    status: 'active'
});
</script>
