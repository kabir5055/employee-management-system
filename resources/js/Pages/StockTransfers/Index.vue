<template>
  <AppLayout title="Stock Transfer">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
          Stock Transfers
        </h2>
        <Link
          v-if="canCreate"
          :href="route('stock-transfers.create')"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
        >
          New Transfer
        </Link>
      </div>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-6 bg-white border-b border-gray-200">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From Warehouse
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To Employee
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="transfer in transfers.data" :key="transfer.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ transfer.from_warehouse.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ transfer.to_employee.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ transfer.product.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {{ transfer.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        {
                          'bg-yellow-100 text-yellow-800': transfer.status === 'pending',
                          'bg-green-100 text-green-800': transfer.status === 'completed',
                          'bg-red-100 text-red-800': transfer.status === 'cancelled'
                        }
                      ]">
                        {{ formatStatus(transfer.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {{ transfer.created_by.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        :href="route('stock-transfers.show', transfer.id)"
                        class="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View
                      </Link>
                      <button
                        v-if="canApprove && transfer.status === 'pending'"
                        @click="approveTransfer(transfer)"
                        class="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        v-if="transfer.status === 'pending'"
                        @click="cancelTransfer(transfer)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="mt-4">
              <Pagination :links="transfers.links" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import Pagination from '@/Components/Pagination.vue';

const props = defineProps({
  transfers: {
    type: Object,
    required: true
  },
  canCreate: {
    type: Boolean,
    required: true
  },
  canApprove: {
    type: Boolean,
    required: true
  }
});

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const approveTransfer = (transfer) => {
  if (confirm(`Are you sure you want to approve this transfer?`)) {
    router.post(route('stock-transfers.approve', transfer.id));
  }
};

const cancelTransfer = (transfer) => {
  if (confirm(`Are you sure you want to cancel this transfer?`)) {
    router.post(route('stock-transfers.cancel', transfer.id));
  }
};
</script>
