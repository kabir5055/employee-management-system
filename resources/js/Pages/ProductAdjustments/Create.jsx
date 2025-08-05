import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ auth, products, typeOptions, reasonOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        type: 'increase',
        quantity_adjusted: '',
        reason: '',
        notes: '',
        adjustment_date: new Date().toISOString().split('T')[0]
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('product-adjustments.store'));
    };

    const selectedProduct = products.find(p => p.id == data.product_id);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Product Adjustment</h2>}
        >
            <Head title="Create Product Adjustment" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Create Product Adjustment</h2>
                                <Link
                                    href={route('product-adjustments.index')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Back to Adjustments
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="product_id" value="Product" />
                                        <select
                                            id="product_id"
                                            name="product_id"
                                            value={data.product_id}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('product_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Product</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} (SKU: {product.sku}) - Stock: {product.stock_quantity}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.product_id && <div className="text-red-600 text-sm mt-1">{errors.product_id}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="type" value="Adjustment Type" />
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('type', e.target.value)}
                                            required
                                        >
                                            {typeOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.type && <div className="text-red-600 text-sm mt-1">{errors.type}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="quantity_adjusted" value="Quantity to Adjust" />
                                        <TextInput
                                            id="quantity_adjusted"
                                            name="quantity_adjusted"
                                            type="number"
                                            min="1"
                                            value={data.quantity_adjusted}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('quantity_adjusted', e.target.value)}
                                            required
                                        />
                                        {errors.quantity_adjusted && <div className="text-red-600 text-sm mt-1">{errors.quantity_adjusted}</div>}
                                        {selectedProduct && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                Current Stock: {selectedProduct.stock_quantity}
                                                {data.quantity_adjusted && (
                                                    <>
                                                        {' → New Stock: '}
                                                        {data.type === 'increase'
                                                            ? selectedProduct.stock_quantity + parseInt(data.quantity_adjusted || 0)
                                                            : Math.max(0, selectedProduct.stock_quantity - parseInt(data.quantity_adjusted || 0))
                                                        }
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="reason" value="Reason" />
                                        <select
                                            id="reason"
                                            name="reason"
                                            value={data.reason}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('reason', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Reason</option>
                                            {reasonOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.reason && <div className="text-red-600 text-sm mt-1">{errors.reason}</div>}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="adjustment_date" value="Adjustment Date" />
                                        <TextInput
                                            id="adjustment_date"
                                            name="adjustment_date"
                                            type="date"
                                            value={data.adjustment_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('adjustment_date', e.target.value)}
                                            required
                                        />
                                        {errors.adjustment_date && <div className="text-red-600 text-sm mt-1">{errors.adjustment_date}</div>}
                                    </div>

                                    <div className="col-span-2">
                                        <InputLabel htmlFor="notes" value="Notes (Optional)" />
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={data.notes}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows="4"
                                            placeholder="Add any additional notes about this adjustment..."
                                            onChange={(e) => setData('notes', e.target.value)}
                                        ></textarea>
                                        {errors.notes && <div className="text-red-600 text-sm mt-1">{errors.notes}</div>}
                                    </div>
                                </div>

                                {/* Summary Card */}
                                {selectedProduct && data.quantity_adjusted && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Adjustment Summary</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Product:</span>
                                                <div className="text-gray-900">{selectedProduct.name}</div>
                                                <div className="text-gray-500">SKU: {selectedProduct.sku}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Stock Change:</span>
                                                <div className="text-gray-900">
                                                    {selectedProduct.stock_quantity} → {' '}
                                                    {data.type === 'increase'
                                                        ? selectedProduct.stock_quantity + parseInt(data.quantity_adjusted)
                                                        : Math.max(0, selectedProduct.stock_quantity - parseInt(data.quantity_adjusted))
                                                    }
                                                </div>
                                                <div className={`font-semibold ${data.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {data.type === 'increase' ? '+' : '-'}{data.quantity_adjusted}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Status:</span>
                                                <div className="text-yellow-600 font-medium">Pending Approval</div>
                                                <div className="text-gray-500 text-xs">Stock will be updated after approval</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end mt-6 space-x-3">
                                    <SecondaryButton type="button">
                                        <Link href={route('product-adjustments.index')}>
                                            Cancel
                                        </Link>
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        Create Adjustment
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
