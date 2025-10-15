"use client";

import React, { useRef } from "react";
import { Truck, Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";


const OrderDetailsDrawer = ({ selectedOrder, setSelectedOrder }) => {
    const contentRef = useRef(null);
    const handleDownloadPDF = useReactToPrint({contentRef});

    return (
        <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.75)] bg-opacity-40 z-[100] flex justify-start"
            onClick={() => setSelectedOrder(null)}
        >
            <div
                className="bg-white w-full sm:w-[400px] h-full shadow-xl p-2 overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <p
                    className="flex w-full justify-end text-xl cursor-pointer"
                    onClick={() => setSelectedOrder(null)}
                >
                    ❌
                </p>

                {/* Printable area */}
                <div ref={contentRef} className="p-3 pb-8">

                    <h2 className="text-lg font-bold flex items-center justify-between gap-2">
                        <span className="flex gap-2">
                            <Truck className="text-purple-600" /> Order Details
                        </span>
                    </h2>

                    <p className="text-sm text-gray-500 mb-2">
                        Order ID: <span className="font-mono">{selectedOrder._id}</span>
                    </p>

                    <h3 className="font-semibold">Customer</h3>
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                    <p>{selectedOrder.email || selectedOrder?.user.email}</p>

                    <h3 className="font-semibold mt-4">Shipping Address</h3>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{" "}
                        {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>

                    <h3 className="font-semibold mt-4 mb-2">Items</h3>
                    <ul className="space-y-2">
                        {selectedOrder.items.map((it, i) => (
                            <li
                                key={i}
                                className="flex justify-between items-center text-sm border-b pb-1"
                            >
                                <p className="flex flex-col gap-1">
                                    <span>{it.product?.name || "Product"} × {it.quantity}</span>
                                    <span>({it.product?.productCode})</span>
                                </p>
                                <span>
                                    ₹{(it.product?.sizes[it.sizeIdx].finalPrice) * it.quantity}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-5 border-t pt-3 text-sm space-y-1 flex flex-col items-end">
                        <p>Subtotal: ₹{selectedOrder.subtotal}</p>
                        <p>Shipping: ₹{selectedOrder.shippingFee}</p>
                        <p className="font-semibold text-lg">Total: ₹{selectedOrder.totalAmount}</p>
                    </div>

                    <p className="text-xs text-gray-400 mt-6 text-center">
                        Thank you for shopping with <strong>Bloom’s Heaven</strong> 🌸
                    </p>
                </div>

                {/* Buttons */}
                <div className="w-full bg-white border-t p-3 flex justify-center">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        <Download size={16} /> Save PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsDrawer;
