<template>
    <AppLayout title="Profile">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <section class="max-w-xl">
                        <header>
                            <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>
                            <p class="mt-1 text-sm text-gray-600">
                                Update your account's profile information and email address.
                            </p>
                        </header>

                        <form @submit.prevent="submit" class="mt-6 space-y-6">
                            <div class="flex items-center space-x-6 mb-4">
                                <div class="shrink-0">
                                    <img v-if="form.profile_photo" :src="previewUrl"
                                        class="h-16 w-16 object-cover rounded-full"
                                        alt="Profile photo preview" />
                                    <img v-else :src="$page.props.auth.user.profile_photo_url"
                                        class="h-16 w-16 object-cover rounded-full"
                                        :alt="$page.props.auth.user.name" />
                                </div>
                                <label class="block">
                                    <span class="sr-only">Choose profile photo</span>
                                    <input type="file"
                                        @input="form.profile_photo = $event.target.files[0]"
                                        accept="image/*"
                                        class="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-violet-50 file:text-violet-700
                                            hover:file:bg-violet-100" />
                                </label>
                            </div>

                            <div>
                                <InputLabel for="name" value="Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    v-model="form.name"
                                    required
                                    autofocus
                                    autocomplete="name"
                                    class="mt-1 block w-full"
                                />
                                <InputError :message="form.errors.name" class="mt-2" />
                            </div>

                            <div>
                                <InputLabel for="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    v-model="form.email"
                                    required
                                    autocomplete="username"
                                    class="mt-1 block w-full"
                                />
                                <InputError :message="form.errors.email" class="mt-2" />
                            </div>

                            <div>
                                <InputLabel for="phone" value="Phone" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    v-model="form.phone"
                                    autocomplete="tel"
                                    class="mt-1 block w-full"
                                />
                                <InputError :message="form.errors.phone" class="mt-2" />
                            </div>

                            <div>
                                <InputLabel for="address" value="Address" />
                                <TextInput
                                    id="address"
                                    type="text"
                                    v-model="form.address"
                                    autocomplete="street-address"
                                    class="mt-1 block w-full"
                                />
                                <InputError :message="form.errors.address" class="mt-2" />
                            </div>

                            <div>
                                <InputLabel for="date_of_birth" value="Date of Birth" />
                                <TextInput
                                    id="date_of_birth"
                                    type="date"
                                    v-model="form.date_of_birth"
                                    class="mt-1 block w-full"
                                />
                                <InputError :message="form.errors.date_of_birth" class="mt-2" />
                            </div>

                            <div class="flex items-center gap-4">
                                <PrimaryButton :disabled="form.processing">Save</PrimaryButton>

                                <Transition
                                    enter-active-class="transition ease-in-out"
                                    enter-from-class="opacity-0"
                                    leave-active-class="transition ease-in-out"
                                    leave-to-class="opacity-0"
                                >
                                    <p v-if="form.recentlySuccessful" class="text-sm text-gray-600">Saved.</p>
                                </Transition>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

const form = useForm({
    name: props.auth?.user?.name || '',
    email: props.auth?.user?.email || '',
    phone: props.auth?.user?.phone || '',
    address: props.auth?.user?.address || '',
    date_of_birth: props.auth?.user?.date_of_birth || '',
    profile_photo: null,
});

const previewUrl = computed(() => {
    if (form.profile_photo) {
        return URL.createObjectURL(form.profile_photo);
    }
    return null;
});

const submit = () => {
    form.post(route('profile.update'), {
        preserveScroll: true,
        onSuccess: () => {
            if (form.profile_photo) {
                URL.revokeObjectURL(previewUrl.value);
                form.profile_photo = null;
            }
        },
    });
};
</script>
