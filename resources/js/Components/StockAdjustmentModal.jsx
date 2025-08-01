import { useForm } from '@inertiajs/react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function StockAdjustmentModal({ show, product, onClose }) {
    const { data, setData, post, processing, reset } = useForm({
        adjustment: 0,
        reason: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update-stock', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const incrementAdjustment = () => {
        setData('adjustment', parseInt(data.adjustment || 0) + 1);
    };

    const decrementAdjustment = () => {
        setData('adjustment', parseInt(data.adjustment || 0) - 1);
    };

    if (!product) return null;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                >
                                    Stock Adjustment - {product.name}
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={handleClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={submit} className="mt-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stock Adjustment
                                        </label>
                                        <div className="flex items-center">
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white p-2 rounded-l hover:bg-red-600"
                                                onClick={decrementAdjustment}
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </button>
                                            <input
                                                type="number"
                                                value={data.adjustment}
                                                onChange={(e) => setData('adjustment', e.target.value)}
                                                className="border-t border-b text-center w-20 py-2 focus:outline-none"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600"
                                                onClick={incrementAdjustment}
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason
                                        </label>
                                        <input
                                            type="text"
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            placeholder="Enter reason for stock adjustment"
                                        />
                                    </div>

                                    <div className="mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                        <p>Current Stock: <span className="font-semibold">{product.stock_quantity}</span></p>
                                        <p>New Stock: <span className="font-semibold">{product.stock_quantity + (parseInt(data.adjustment) || 0)}</span></p>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Stock'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
