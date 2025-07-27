<template>
  <AppLayout title="Employee Stocks">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
          Employee Stocks
        </h2>
      </div>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <!-- Employee Stock Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="employeeStock in employeeStocks" :key="employeeStock.employee.id" class="bg-white rounded-lg shadow">
            <div class="p-6">
              <!-- Employee Info -->
              <div class="flex items-center mb-4">
                <div class="flex-shrink-0 h-12 w-12">
                  <img :src="employeeStock.employee.profile_photo_url" class="h-12 w-12 rounded-full" :alt="employeeStock.employee.name">
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ employeeStock.employee.name }}
                  </h3>
                </div>
              </div>

              <!-- Stock Table -->
              <div class="mt-6">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th v-if="canManageAllStocks" class="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="stock in employeeStock.stocks" :key="stock.id">
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {{ stock.product.name }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-right">
                        {{ stock.quantity }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-center">
                        <span :class="[
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                          {
                            'bg-red-100 text-red-800': stock.status === 'out_of_stock',
                            'bg-yellow-100 text-yellow-800': stock.status === 'low_stock',
                            'bg-green-100 text-green-800': stock.status === 'in_stock',
                            'bg-blue-100 text-blue-800': stock.status === 'overstock'
                          }
                        ]">
                          {{ formatStatus(stock.status) }}
                        </span>
                      </td>
                      <td v-if="canManageAllStocks" class="px-3 py-2 whitespace-nowrap text-right text-sm">
                        <button @click="openUpdateModal(stock)" class="text-indigo-600 hover:text-indigo-900">
                          Update
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- View Details Link -->
              <div class="mt-4 flex justify-end">
                <Link :href="route('employee-stocks.show', employeeStock.employee.id)" class="text-sm text-indigo-600 hover:text-indigo-900">
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Stock Modal -->
    <Modal :show="updateModal" @close="closeUpdateModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Update Stock
        </h3>

        <form @submit.prevent="updateStock" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" v-model="form.quantity" min="0" required class="mt-1 block w-full rounded-md border-gray-300">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Minimum Quantity</label>
            <input type="number" v-model="form.minimum_quantity" min="0" required class="mt-1 block w-full rounded-md border-gray-300">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Maximum Quantity</label>
            <input type="number" v-model="form.maximum_quantity" min="0" required class="mt-1 block w-full rounded-md border-gray-300">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea v-model="form.notes" rows="3" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button" @click="closeUpdateModal" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700">
              Update
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import Modal from '@/Components/Modal.vue';

const props = defineProps({
  employeeStocks: {
    type: Array,
    required: true
  },
  canManageAllStocks: {
    type: Boolean,
    required: true
  }
});

// Status formatting
const formatStatus = (status) => {
  return status.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Update Modal
const updateModal = ref(false);
const selectedStock = ref(null);
const form = useForm({
  quantity: 0,
  minimum_quantity: 0,
  maximum_quantity: 0,
  notes: ''
});

const openUpdateModal = (stock) => {
  selectedStock.value = stock;
  form.quantity = stock.quantity;
  form.minimum_quantity = stock.minimum_quantity;
  form.maximum_quantity = stock.maximum_quantity;
  form.notes = '';
  updateModal.value = true;
};

const closeUpdateModal = () => {
  updateModal.value = false;
  selectedStock.value = null;
  form.reset();
};

const updateStock = () => {
  if (!selectedStock.value) return;

  form.put(route('employee-stocks.update', selectedStock.value.id), {
    onSuccess: () => closeUpdateModal()
  });
};
</script>
