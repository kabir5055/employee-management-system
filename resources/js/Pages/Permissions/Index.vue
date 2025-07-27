<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Permissions</h2>
                        <Link :href="route('permissions.create')" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Create Permission
                        </Link>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b">Name</th>
                                    <th class="py-2 px-4 border-b">Slug</th>
                                    <th class="py-2 px-4 border-b">Description</th>
                                    <th class="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="permission in permissions.data" :key="permission.id">
                                    <td class="py-2 px-4 border-b">{{ permission.name }}</td>
                                    <td class="py-2 px-4 border-b">{{ permission.slug }}</td>
                                    <td class="py-2 px-4 border-b">{{ permission.description }}</td>
                                    <td class="py-2 px-4 border-b">
                                        <Link :href="route('permissions.edit', permission.id)" class="text-blue-500 hover:underline mr-2">
                                            Edit
                                        </Link>
                                        <button @click="deletePermission(permission)" class="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination :links="permissions.links" class="mt-6" />
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
    permissions: Object
});

const deletePermission = (permission) => {
    if (confirm('Are you sure you want to delete this permission?')) {
        Inertia.delete(route('permissions.destroy', permission.id));
    }
};
</script>
