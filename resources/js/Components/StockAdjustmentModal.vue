<template>
    <div class="fixed inset-0 overflow-y-auto" v-if="show">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" @click="close">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form @submit.prevent="submit">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="adjustment">
                                Stock Adjustment
                            </label>
                            <div class="flex items-center">
                                <button
                                    type="button"
                                    class="bg-red-500 text-white px-3 py-2 rounded-l"
                                    @click="() => form.adjustment = parseInt(form.adjustment || 0) - 1"
                                >
                                    -
                                </button>
                                <input
                                    v-model="form.adjustment"
                                    type="number"
                                    class="shadow appearance-none border text-center w-20 py-2"
                                    required
                                >
                                <button
                                    type="button"
                                    class="bg-green-500 text-white px-3 py-2 rounded-r"
                                    @click="() => form.adjustment = parseInt(form.adjustment || 0) + 1"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="reason">
                                Reason
                            </label>
                            <input
                                v-model="form.reason"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                required
                            >
                        </div>

                        <div class="text-sm text-gray-500">
                            <p>Current Stock: {{ product.stock_quantity }}</p>
                            <p>New Stock: {{ product.stock_quantity + (parseInt(form.adjustment) || 0) }}</p>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            :disabled="form.processing"
                        >
                            Update Stock
                        </button>
                        <button
                            type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            @click="close"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useForm } from '@inertiajs/inertia-vue3';

const props = defineProps({
    show: Boolean,
    product: Object
});

const emit = defineEmits(['close']);

const form = useForm({
    adjustment: 0,
    reason: ''
});

const submit = () => {
    form.post(route('products.update-stock', props.product.id), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            emit('close');
        }
    });
};

const close = () => {
    form.reset();
    emit('close');
};
</script>
