"use client";

import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Truck, Search, Package, Download } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const TrackOrder = () => {
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const contentRef = useRef(null);
      const handleDownloadPDF = useReactToPrint({contentRef});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setOrder(null);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/search`,
        {
          params: { query: searchValue },
        }
      );

      if (res.data?.order) {
        setOrder(res.data.order);
      } else {
        setErrorMsg("No order found with that ID or transaction ID.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue === "") {
      setOrder(null);
    }
  }, [searchValue])

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="text-purple-600" /> Track Your Order
      </h1>

      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-6 max-w-md mx-auto"
      >

        <input
          type="text"
          placeholder="Enter Order ID or Transaction ID"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {
          order === null ?
            <button
              type="submit"
              className="flex justify-center bg-purple-600 text-white min-w-24 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
            >
              <Search size={18} /> Search
            </button>
            :
            <button onClick={() => setSearchValue("")} className="flex justify-center bg-purple-600 text-white min-w-24 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-5 h-5 font-semibold' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
            </button>
        }


      </form>

      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          Searching your order...
        </div>
      )}

      {!loading && errorMsg && (
        <div className="text-center text-red-500 mt-6">{errorMsg}</div>
      )}

      {/* 🧾 Order Card */}
      {!loading && order && (
        <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Order #{order._id.slice(-6).toUpperCase()}
              </p>
              <p className="text-sm text-gray-600">
                {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[order.status]}`}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-3 border-t pt-3 space-y-2">
            {order?.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div
                  className="flex items-center gap-2"
                >
                  <Image
                    src={item.product?.images[0]?.imgUrl}
                    alt={item.product?.name || "Product"}
                    width={40}
                    height={40}
                    className="rounded-md object-cover border"
                  />
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} | ₹
                      {item.product?.sizes[item.sizeIdx]?.finalPrice}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  ₹
                  {(
                    item.product?.sizes[item.sizeIdx]?.finalPrice *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between text-sm border-t pt-2">
            <p className="text-gray-600">
              Payment:{" "}
              <span className="font-medium">{order.paymentMethod}</span>
            </p>
            <p className="font-semibold">Total: ₹{order.totalAmount}</p>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            <p>
              Transaction ID:{" "}
              <span className="font-mono">{order.transactionId || "—"}</span>
            </p>
          </div>

          <div className="mt-3 text-right">
            <button
              onClick={() => setSelectedOrder(order)}
              className="text-purple-600 text-sm hover:underline"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* No Result Default */}
      {!loading && !order && !errorMsg && (
        <div className="text-center text-gray-400 my-20">
          <Package className="mx-auto w-12 h-12 mb-3" />
          <p>Enter your Order ID or Transaction ID to track your order.</p>
        </div>
      )}

      {/* ✅ Order Details Drawer */}
      {(selectedOrder && order) && (
        <div
          className="fixed inset-0 bg-black/60 z-[50] flex justify-start"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full sm:w-[400px] h-full shadow-xl p-2 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex w-full justify-end">
              <button onClick={() => setSelectedOrder(null)}>❌</button>
            </div>

            <div ref={contentRef} className="flex flex-col p-3">
              <h2 className="text-lg font-bold flex items-center justify-between">
                <span className="flex gap-2">
                  <Truck className="text-purple-600" /> Order Details
                </span>
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Order ID: <span className="font-mono">{selectedOrder._id}</span>
              </p>

              <h3 className="font-semibold mb-2">Shipping To:</h3>
              <p>{selectedOrder.shippingAddress.fullName}</p>
              <p>{selectedOrder.shippingAddress.phone}</p>
              <p>{selectedOrder.email}</p>
              <p className="pt-2">
                {selectedOrder.shippingAddress.street},{" "}
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state}{" "}
                {selectedOrder.shippingAddress.postalCode}
              </p>

              <h3 className="font-semibold mt-4 mb-2">Items:</h3>
              <ul className="space-y-2">
                {selectedOrder.items.map((it, i) => (
                  <li
                    key={i}
                    className="flex justify-between text-sm border-b pb-1"
                  >
                    <p>
                      {it.product?.name} × {it.quantity}
                    </p>
                    <span>
                      ₹
                      {(
                        it.product?.sizes[it.sizeIdx]?.finalPrice * it.quantity
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t pt-3 text-sm space-y-1 text-right">
                <p>Subtotal: ₹{selectedOrder.subtotal}</p>
                <p>Shipping: ₹{selectedOrder.shippingFee}</p>
                <p className="font-semibold text-lg">
                  Total: ₹{selectedOrder.totalAmount}
                </p>
              </div>

              <p className="text-xs text-gray-400 mt-6 text-center">
                        Thank you for shopping with <strong>Bloom’s Heaven</strong> 🌸
                    </p>
            </div>

            {/* Buttons */}
                <div className="w-full bg-white border-t mt-8 p-3 flex justify-center">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        <Download size={16} /> Save PDF
                    </button>
                </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
