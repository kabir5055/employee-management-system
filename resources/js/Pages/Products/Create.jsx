import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        cost_price: '',
        stock_quantity: '',
        sku: '',
        status: 'active'
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Product</h2>}
        >
            <Head title="Create Product" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Create Product</h2>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Back to Products
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <InputLabel htmlFor="price" value="Price" />
                                        <TextInput
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('price', e.target.value)}
                                            required
                                        />
                                        {errors.price && <div className="text-red-600 text-sm mt-1">{errors.price}</div>}
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
                                            required
                                        />
                                        {errors.cost_price && <div className="text-red-600 text-sm mt-1">{errors.cost_price}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="stock_quantity" value="Stock Quantity" />
                                        <TextInput
                                            id="stock_quantity"
                                            name="stock_quantity"
                                            type="number"
                                            min="0"
                                            value={data.stock_quantity}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('stock_quantity', e.target.value)}
                                            required
                                        />
                                        {errors.stock_quantity && <div className="text-red-600 text-sm mt-1">{errors.stock_quantity}</div>}
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

                                    <div className="col-span-2">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows="3"
                                            onChange={(e) => setData('description', e.target.value)}
                                        ></textarea>
                                        {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6 space-x-3">
                                    <SecondaryButton type="button">
                                        <Link href={route('products.index')}>
                                            Cancel
                                        </Link>
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        Create Product
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
