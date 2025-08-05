import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import RichTextEditor from '@/Components/RichTextEditor';
import { ArrowLeftIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Edit({ auth, product, categories, units }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        cost_price: product.cost_price ? String(product.cost_price) : '',
        tp_price: product.tp_price ? String(product.tp_price) : '',
        mrp_price: product.mrp_price ? String(product.mrp_price) : '',
        sku: product.sku || '',
        category_id: product.category_id ? String(product.category_id) : '',
        unit_id: product.unit_id ? String(product.unit_id) : '',
        status: product.status || 'active',
        images: [],
        remove_images: [],
        primary_image_index: 0
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [existingImages, setExistingImages] = useState(product.images || []);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + existingImages.length > 5) {
            alert('Maximum 5 images allowed including existing images');
            return;
        }

        // Create preview URLs
        const previews = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }));

        setSelectedImages(previews);
        setData('images', files);
    };

    const removeExistingImage = (indexToRemove) => {
        const imageToRemove = existingImages[indexToRemove];
        const newExistingImages = existingImages.filter((_, index) => index !== indexToRemove);

        setExistingImages(newExistingImages);
        setData('remove_images', [...data.remove_images, imageToRemove]);
    };

    const removeNewImage = (indexToRemove) => {
        const newImages = selectedImages.filter((_, index) => index !== indexToRemove);
        const newFiles = Array.from(data.images).filter((_, index) => index !== indexToRemove);

        setSelectedImages(newImages);
        setData('images', newFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Form data before submission:', data);

        // If there are new images, use FormData
        if (data.images && data.images.length > 0) {
            const formData = new FormData();

            // Add regular fields
            formData.append('name', data.name || '');
            formData.append('description', data.description || '');
            formData.append('sku', data.sku || '');
            formData.append('status', data.status || 'active');

            if (data.cost_price) formData.append('cost_price', data.cost_price);
            if (data.tp_price) formData.append('tp_price', data.tp_price);
            if (data.mrp_price) formData.append('mrp_price', data.mrp_price);
            if (data.category_id) formData.append('category_id', data.category_id);
            if (data.unit_id) formData.append('unit_id', data.unit_id);

            // Add new images
            data.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });

            // Add images to remove
            if (data.remove_images && data.remove_images.length > 0) {
                data.remove_images.forEach((image, index) => {
                    formData.append(`remove_images[${index}]`, image);
                });
            }

            put(route('products.update', { product: product.id }), {
                data: formData,
                forceFormData: true,
            });
        } else {
            // Use regular form submission if no new images
            const submitData = {
                name: data.name || '',
                description: data.description || '',
                sku: data.sku || '',
                status: data.status || 'active',
                cost_price: data.cost_price || null,
                tp_price: data.tp_price || null,
                mrp_price: data.mrp_price || null,
                category_id: data.category_id || null,
                unit_id: data.unit_id || null,
                remove_images: data.remove_images || []
            };

            put(route('products.update', { product: product.id }), submitData);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Product</h2>}
        >
            <Head title="Edit Product" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Edit Product</h2>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Back to Products
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sku" value="SKU" />
                                        <TextInput
                                            id="sku"
                                            name="sku"
                                            value={data.sku}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('sku', e.target.value)}
                                            required
                                        />
                                        {errors.sku && <div className="text-red-600 text-sm mt-1">{errors.sku}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="cost_price" value="Cost Price" />
                                        <TextInput
                                            id="cost_price"
                                            name="cost_price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.cost_price}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('cost_price', e.target.value)}
                                        />
                                        {errors.cost_price && <div className="text-red-600 text-sm mt-1">{errors.cost_price}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tp_price" value="TP Price" />
                                        <TextInput
                                            id="tp_price"
                                            name="tp_price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.tp_price}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('tp_price', e.target.value)}
                                        />
                                        {errors.tp_price && <div className="text-red-600 text-sm mt-1">{errors.tp_price}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="mrp_price" value="MRP Price" />
                                        <TextInput
                                            id="mrp_price"
                                            name="mrp_price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.mrp_price}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('mrp_price', e.target.value)}
                                        />
                                        {errors.mrp_price && <div className="text-red-600 text-sm mt-1">{errors.mrp_price}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="category_id" value="Category" />
                                        <select
                                            id="category_id"
                                            name="category_id"
                                            value={data.category_id}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('category_id', e.target.value)}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <div className="text-red-600 text-sm mt-1">{errors.category_id}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="unit_id" value="Unit" />
                                        <select
                                            id="unit_id"
                                            name="unit_id"
                                            value={data.unit_id}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('unit_id', e.target.value)}
                                        >
                                            <option value="">Select Unit</option>
                                            {units.map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.name} ({unit.short_name})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.unit_id && <div className="text-red-600 text-sm mt-1">{errors.unit_id}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('status', e.target.value)}
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        {errors.status && <div className="text-red-600 text-sm mt-1">{errors.status}</div>}
                                    </div>

                                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <div className="mt-1">
                                            <RichTextEditor
                                                value={data.description}
                                                onChange={(value) => setData('description', value)}
                                                placeholder="Enter product description..."
                                                className="min-h-[120px]"
                                            />
                                        </div>
                                        {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                                    </div>

                                    {/* Existing Images */}
                                    {existingImages.length > 0 && (
                                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                            <InputLabel value="Current Images" />
                                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                {existingImages.map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={`/storage/${image}`}
                                                            alt={`Current ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(index)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Remove image"
                                                        >
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New Image Upload */}
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                        <InputLabel htmlFor="images" value="Add New Images (Max 5 total)" />
                                        <div className="mt-1">
                                            <input
                                                type="file"
                                                id="images"
                                                name="images"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                            {errors.images && <div className="text-red-600 text-sm mt-1">{errors.images}</div>}

                                            {/* New Image Previews */}
                                            {selectedImages.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium mb-2">New Images:</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                        {selectedImages.map((image, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={image.url}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewImage(index)}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Remove image"
                                                                >
                                                                    <XMarkIcon className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6 space-x-3">
                                    <SecondaryButton type="button">
                                        <Link href={route('products.index')}>
                                            Cancel
                                        </Link>
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        Update Product
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
