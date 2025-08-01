import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import StockAdjustmentModal from '@/Components/StockAdjustmentModal';
import { PlusIcon, PencilIcon, TrashIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, products }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { delete: destroy } = useForm();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const deleteProduct = (product) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', product.id));
        }
    };

    const openStockAdjustment = (product) => {
        setSelectedProduct(product);
    };

    const getStockStatusColor = (quantity) => {
        if (quantity < 10) return 'text-red-600';
        if (quantity < 20) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getStatusBadgeClass = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Products</h2>
                                <Link
                                    href={route('products.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Create Product
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 border-b text-sm font-medium text-gray-900">
                                                    {product.sku}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    {formatCurrency(product.price)}
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm text-gray-900">
                                                    {formatCurrency(product.cost_price)}
                                                </td>
                                                <td className={`py-3 px-4 border-b text-sm font-medium ${getStockStatusColor(product.stock_quantity)}`}>
                                                    {product.stock_quantity}
                                                </td>
                                                <td className="py-3 px-4 border-b">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(product.status)}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 border-b text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={route('products.edit', product.id)}
                                                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                        >
                                                            <PencilIcon className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteProduct(product)}
                                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                        >
                                                            <TrashIcon className="w-4 h-4 mr-1" />
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => openStockAdjustment(product)}
                                                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                                                        >
                                                            <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1" />
                                                            Adjust Stock
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination links={products.links} className="mt-6" />
                        </div>
                    </div>
                </div>
            </div>

            <StockAdjustmentModal
                show={!!selectedProduct}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </AuthenticatedLayout>
    );
}
