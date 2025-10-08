"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Truck } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const UserOrders = () => {
  const user = useSelector((state) => state?.user?.data)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ Fetch user orders
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/user-orders`,
        { withCredentials: true }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center text-gray-500 my-20">
        <Package className="mx-auto w-12 h-12 text-gray-400 mb-3" />
        <p>No orders yet. Start shopping today!</p>
        <Link
          href={{
            pathname: "/collection_products",
            query: { category: "All Products", id: "68db488464d038f4c3298faa" }, // pass subcategory as query param
          }}
          className='flex w-full justify-center text-sm items-center p-1 underline   text-blue-600'
        >
          Continue shopping {">>"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="text-purple-600" /> My Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-800">
                  {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[order.status]
                  }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-3 border-t pt-3 space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <Link href={{
                    pathname: "/product_view",
                    query: { id: item?.product?._id }, // pass product ID as query param
                  }} className="flex items-center gap-2">
                    <Image
                      src={item.product?.images[0].imgUrl}
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
                  </Link>
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

            <div className="mt-3 text-right">
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-purple-600 text-sm hover:underline"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Order Details Drawer */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex justify-start"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full sm:w-[400px] h-full shadow-xl p-2 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex w-full justify-end">
              <button onClick={() => setSelectedOrder(null)}>❌</button>
            </div>

            <div className="flex flex-col p-3">
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
              <p>{selectedOrder.email || user?.email}</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
