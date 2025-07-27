<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Products</h2>
                        <Link :href="route('products.create')" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Create Product
                        </Link>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b">SKU</th>
                                    <th class="py-2 px-4 border-b">Name</th>
                                    <th class="py-2 px-4 border-b">Price</th>
                                    <th class="py-2 px-4 border-b">Cost Price</th>
                                    <th class="py-2 px-4 border-b">Stock</th>
                                    <th class="py-2 px-4 border-b">Status</th>
                                    <th class="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in products.data" :key="product.id">
                                    <td class="py-2 px-4 border-b">{{ product.sku }}</td>
                                    <td class="py-2 px-4 border-b">{{ product.name }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(product.price) }}</td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(product.cost_price) }}</td>
                                    <td class="py-2 px-4 border-b" :class="{
                                        'text-red-600': product.stock_quantity < 10,
                                        'text-yellow-600': product.stock_quantity >= 10 && product.stock_quantity < 20,
                                        'text-green-600': product.stock_quantity >= 20
                                    }">
                                        {{ product.stock_quantity }}
                                    </td>
                                    <td class="py-2 px-4 border-b">
                                        <span :class="{
                                            'px-2 py-1 rounded text-sm': true,
                                            'bg-green-100 text-green-800': product.status === 'active',
                                            'bg-red-100 text-red-800': product.status === 'inactive'
                                        }">
                                            {{ product.status }}
                                        </span>
                                    </td>
                                    <td class="py-2 px-4 border-b">{{ formatCurrency(product.cost_price) }}</td>
                                    <td class="py-2 px-4 border-b">{{ product.stock_quantity }}</td>
                                    <td class="py-2 px-4 border-b">
                                        <span :class="{
                                            'px-2 py-1 rounded text-sm': true,
                                            'bg-green-100 text-green-800': product.status === 'active',
                                            'bg-red-100 text-red-800': product.status === 'inactive'
                                        }">
                                            {{ product.status }}
                                        </span>
                                    </td>
                                    <td class="py-2 px-4 border-b">
                                        <Link :href="route('products.edit', product.id)" class="text-blue-500 hover:underline mr-2">
                                            Edit
                                        </Link>
                                        <button @click="deleteProduct(product)" class="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                        <button @click="openStockAdjustment(product)" class="text-blue-500 hover:underline ml-2">
                                            Adjust Stock
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination :links="products.links" class="mt-6" />
                </div>
            </div>
        </div>
    </div>

    <StockAdjustmentModal
        :show="!!selectedProduct"
        :product="selectedProduct"
        @close="selectedProduct = null"
    />
</template>

<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/inertia-vue3';
import { Inertia } from '@inertiajs/inertia';
import Pagination from '@/Components/Pagination.vue';
import StockAdjustmentModal from '@/Components/StockAdjustmentModal.vue';

defineProps({
    products: Object
});

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const selectedProduct = ref(null);

const deleteProduct = (product) => {
    if (confirm('Are you sure you want to delete this product?')) {
        Inertia.delete(route('products.destroy', product.id));
    }
};

const openStockAdjustment = (product) => {
    selectedProduct.value = product;
};
</script>
