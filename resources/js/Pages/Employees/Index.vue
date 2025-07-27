<template>
    <AppLayout title="Employees">
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Employees
                </h2>
                <Link
                    :href="route('employees.create')"
                    class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    Add Employee
                </Link>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <!-- Filters -->
                <EmployeeFilter
                    :districts="districts"
                    :departments="departments"
                    :positions="positions"
                    :filters="filters"
                />

                <!-- Import/Export -->
                <div class="mb-6">
                    <ImportExport
                        title="Employees"
                        :export-route="route('employees.export')"
                        :import-route="route('employees.import')"
                        @import-success="$inertia.reload()"
                        @export-success="$inertia.reload()"
                    />
                </div>

                <!-- Employee List -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="employee in employees.data" :key="employee.id">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <img :src="employee.profile_photo_url"
                                                        :alt="employee.name"
                                                        class="h-10 w-10 rounded-full" />
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">
                                                        {{ employee.name }}
                                                    </div>
                                                    <div class="text-sm text-gray-500">
                                                        {{ employee.email }}
                                                    </div>
                                                    <div v-if="employee.employee_code" class="text-xs text-gray-400">
                                                        ID: {{ employee.employee_code }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ employee.department?.name }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ employee.position?.name }}
                                            </div>
                                            <div v-if="employee.designation" class="text-xs text-gray-500">
                                                {{ employee.designation }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">
                                                {{ employee.district?.name }}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {{ employee.upazila?.name }}, {{ employee.thana?.name }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span :class="[
                                                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                                employee.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            ]">
                                                {{ employee.status }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link :href="route('employees.edit', employee.id)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                Edit
                                            </Link>
                                            <button @click="deleteEmployee(employee)" class="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="mt-4">
                            <Pagination :links="employees.links" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import EmployeeFilter from '@/Components/EmployeeFilter.vue';
import Pagination from '@/Components/Pagination.vue';
import ImportExport from '@/Components/ImportExport.vue';

const props = defineProps({
    employees: {
        type: Object,
        required: true,
    },
    districts: {
        type: Array,
        required: true,
    },
    departments: {
        type: Array,
        required: true,
    },
    positions: {
        type: Array,
        required: true,
    },
    filters: {
        type: Object,
        required: true,
    },
});

const deleteEmployee = (employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
        router.delete(route('employees.destroy', employee.id));
    }
};
</script>
