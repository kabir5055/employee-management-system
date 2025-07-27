<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold">Roles</h2>
                        <Link :href="route('roles.create')" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Create Role
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
                                <tr v-for="role in roles.data" :key="role.id">
                                    <td class="py-2 px-4 border-b">{{ role.name }}</td>
                                    <td class="py-2 px-4 border-b">{{ role.slug }}</td>
                                    <td class="py-2 px-4 border-b">{{ role.description }}</td>
                                    <td class="py-2 px-4 border-b">
                                        <Link :href="route('roles.edit', role.id)" class="text-blue-500 hover:underline mr-2">
                                            Edit
                                        </Link>
                                        <button @click="deleteRole(role)" class="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination :links="roles.links" class="mt-6" />
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
    roles: Object
});

const deleteRole = (role) => {
    if (confirm('Are you sure you want to delete this role?')) {
        Inertia.delete(route('roles.destroy', role.id));
    }
};
</script>
