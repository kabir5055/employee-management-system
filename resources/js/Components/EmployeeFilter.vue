<template>
    <div class="bg-white p-4 rounded-lg shadow mb-6">
        <form @submit.prevent="filter" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Search -->
                <div>
                    <InputLabel for="search" value="Search" />
                    <TextInput
                        id="search"
                        v-model="form.search"
                        type="text"
                        placeholder="Name, Email, ID..."
                        class="mt-1 block w-full"
                    />
                </div>

                <!-- District -->
                <div>
                    <InputLabel for="district" value="District" />
                    <select
                        id="district"
                        v-model="form.district"
                        @change="loadUpazilas"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select District</option>
                        <option v-for="district in districts" :key="district.id" :value="district.id">
                            {{ district.name }}
                        </option>
                    </select>
                </div>

                <!-- Upazila -->
                <div>
                    <InputLabel for="upazila" value="Upazila" />
                    <select
                        id="upazila"
                        v-model="form.upazila"
                        @change="loadThanas"
                        :disabled="!form.district"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select Upazila</option>
                        <option v-for="upazila in upazilas" :key="upazila.id" :value="upazila.id">
                            {{ upazila.name }}
                        </option>
                    </select>
                </div>

                <!-- Thana -->
                <div>
                    <InputLabel for="thana" value="Thana" />
                    <select
                        id="thana"
                        v-model="form.thana"
                        :disabled="!form.upazila"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select Thana</option>
                        <option v-for="thana in thanas" :key="thana.id" :value="thana.id">
                            {{ thana.name }}
                        </option>
                    </select>
                </div>

                <!-- Department -->
                <div>
                    <InputLabel for="department" value="Department" />
                    <select
                        id="department"
                        v-model="form.department"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select Department</option>
                        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                            {{ dept.name }}
                        </option>
                    </select>
                </div>

                <!-- Position -->
                <div>
                    <InputLabel for="position" value="Position" />
                    <select
                        id="position"
                        v-model="form.position"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select Position</option>
                        <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                            {{ pos.name }}
                        </option>
                    </select>
                </div>

                <!-- Designation -->
                <div>
                    <InputLabel for="designation" value="Designation" />
                    <TextInput
                        id="designation"
                        v-model="form.designation"
                        type="text"
                        class="mt-1 block w-full"
                    />
                </div>

                <!-- Status -->
                <div>
                    <InputLabel for="status" value="Status" />
                    <select
                        id="status"
                        v-model="form.status"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <!-- Date Range -->
                <div>
                    <InputLabel for="dateFrom" value="Date From" />
                    <TextInput
                        id="dateFrom"
                        v-model="form.dateFrom"
                        type="date"
                        class="mt-1 block w-full"
                    />
                </div>

                <div>
                    <InputLabel for="dateTo" value="Date To" />
                    <TextInput
                        id="dateTo"
                        v-model="form.dateTo"
                        type="date"
                        class="mt-1 block w-full"
                    />
                </div>
            </div>

            <div class="flex justify-end space-x-3">
                <SecondaryButton @click="reset">
                    Reset
                </SecondaryButton>
                <PrimaryButton :disabled="processing">
                    Apply Filters
                </PrimaryButton>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

const props = defineProps({
    districts: {
        type: Array,
        required: true
    },
    departments: {
        type: Array,
        required: true
    },
    positions: {
        type: Array,
        required: true
    },
    filters: {
        type: Object,
        required: true
    }
});

const processing = ref(false);
const upazilas = ref([]);
const thanas = ref([]);

const form = ref({
    search: props.filters.search || '',
    district: props.filters.district || '',
    upazila: props.filters.upazila || '',
    thana: props.filters.thana || '',
    department: props.filters.department || '',
    position: props.filters.position || '',
    designation: props.filters.designation || '',
    status: props.filters.status || '',
    dateFrom: props.filters.dateFrom || '',
    dateTo: props.filters.dateTo || ''
});

const loadUpazilas = async () => {
    if (form.value.district) {
        const response = await fetch(`/api/districts/${form.value.district}/upazilas`);
        upazilas.value = await response.json();
        form.value.upazila = '';
        form.value.thana = '';
        thanas.value = [];
    } else {
        upazilas.value = [];
        form.value.upazila = '';
        form.value.thana = '';
        thanas.value = [];
    }
};

const loadThanas = async () => {
    if (form.value.upazila) {
        const response = await fetch(`/api/upazilas/${form.value.upazila}/thanas`);
        thanas.value = await response.json();
        form.value.thana = '';
    } else {
        thanas.value = [];
        form.value.thana = '';
    }
};

// Load initial data if filters are set
if (form.value.district) {
    loadUpazilas();
}
if (form.value.upazila) {
    loadThanas();
}

const filter = () => {
    processing.value = true;
    router.get(route(route().current()), {
        ...form.value,
        page: 1,
    }, {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
            processing.value = false;
        },
    });
};

const reset = () => {
    form.value = {
        search: '',
        district: '',
        upazila: '',
        thana: '',
        department: '',
        position: '',
        designation: '',
        status: '',
        dateFrom: '',
        dateTo: ''
    };
    filter();
};
</script>
