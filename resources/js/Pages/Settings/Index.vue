<template>
    <AppLayout title="Settings">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Settings
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <form @submit.prevent="submit">
                            <div v-for="(groupSettings, group) in settings" :key="group" class="mb-8">
                                <h3 class="text-lg font-medium text-gray-900 mb-4">{{ group }}</h3>

                                <div v-for="setting in groupSettings" :key="setting.id" class="mb-4">
                                    <div class="form-control">
                                        <label class="label">
                                            <span class="label-text">{{ setting.label }}</span>
                                        </label>

                                        <!-- Text Input -->
                                        <input v-if="setting.type === 'text'"
                                            v-model="form[setting.key]"
                                            type="text"
                                            class="input input-bordered w-full"
                                        />

                                        <!-- Color Input -->
                                        <input v-if="setting.type === 'color'"
                                            v-model="form[setting.key]"
                                            type="color"
                                            class="h-10 w-20"
                                        />

                                        <!-- File Input -->
                                        <div v-if="setting.type === 'file'" class="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                @change="(e) => handleFileUpload(e, setting.key)"
                                                class="file-input file-input-bordered w-full max-w-xs"
                                            />
                                            <img v-if="setting.value" :src="setting.value" class="h-10 w-10 object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6">
                                <PrimaryButton :disabled="processing">Save Settings</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';

const props = defineProps({
    settings: {
        type: Object,
        required: true
    }
});

const form = useForm({});
const processing = ref(false);

// Initialize form with current settings
Object.entries(props.settings).forEach(([group, groupSettings]) => {
    groupSettings.forEach(setting => {
        form[setting.key] = setting.value;
    });
});

const handleFileUpload = (event, key) => {
    const file = event.target.files[0];
    if (file) {
        form[key] = file;
    }
};

const submit = () => {
    processing.value = true;
    form.post(route('settings.update'), {
        preserveScroll: true,
        onSuccess: () => {
            processing.value = false;
        },
        onError: () => {
            processing.value = false;
        }
    });
};
</script>
