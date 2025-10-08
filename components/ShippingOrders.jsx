"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Loader2, Package, Search } from "lucide-react";
import OrderDetailsDrawer from "./OrderDetailsDrawer";

const ShippingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch all orders based on filter + search
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        {
          params: {
            status: filter,      // 'pending', 'delivered', etc.
            date,
            search
          },
          withCredentials: true,
        }
      );

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever filter or search changes
  useEffect(() => {
    fetchOrders();
  }, [filter, date, search]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
      alert("❌ Failed to update status");
    } finally {
      setUpdating(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-purple-600" /> Manage Orders
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-8 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {search.trim() &&
              <p className='absolute right-2 top-[10px] flex w-fit text-black p-1 rounded-full bg-gray-200'>
                <button onClick={() => setSearch("")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-[14px] h-[14px]' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                </button>
              </p>}
          </div>
          <div className="flex gap-2">
            {/* 🗓️ Date Filter */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="ml-auto border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-purple-600" size={32} />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-center">Order ID</th>
                <th className="p-3 text-center">Customer</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Payment</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition cursor-default text-center"
                >
                  <td className="p-3 font-mono text-xs" onClick={() => setSelectedOrder(order)}>{order._id.slice(-6)}...</td>
                  <td className="p-3" onClick={() => setSelectedOrder(order)}>{order.shippingAddress.fullName}</td>
                  <td className="p-3 font-semibold" onClick={() => setSelectedOrder(order)}>₹{order.totalAmount}</td>
                  <td className="p-3 grid grid-col-1 sm:grid-cols-2 justify-center" onClick={() => setSelectedOrder(order)}>
                    <span className="flex justify-center text-xs p-1">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-sm ${order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3" onClick={() => setSelectedOrder(order)}>
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : (order.status === "shipped" || order.status === "out_for_delivery")
                          ? "bg-blue-100 text-blue-700"
                          : (order.status === "cancelled" || order.status === "returned" || order.status === "refunded")
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-800" onClick={() => setSelectedOrder(order)}>
                    {format(new Date(order.createdAt), "hh:mm a, dd/MM/yy")}
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      {["pending",
                        "processing",
                        "packed",
                        "shipped",
                        "out_for_delivery",
                        "delivered",
                        "cancelled",
                        "returned",
                        "refunded"].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          )
                        )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Drawer */}
      {selectedOrder && (
        <OrderDetailsDrawer
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default ShippingOrders;
