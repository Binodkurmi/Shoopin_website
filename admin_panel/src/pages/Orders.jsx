import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    console.log("fetchAllOrders - Token received:", token);
    if (!token) {
      console.log("No token available - Skipping fetch");
      toast.error("Admin token required to fetch orders");
      return null;
    }
    try {
      console.log("Fetching all orders with token:", token);
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { Authorization: `Bearer ${token}` } } // Fixed header
      );
      console.log("Admin Orders API Response:", response.data);
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
        console.log("Fetched orders:", response.data.orders);
      } else {
        toast.error(response.data.message);
        console.log("API error:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error.response?.data || error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      console.log("Updating status for orderId:", orderId, "to:", event.target.value);
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } } // Fixed header
      );
      console.log("Status Update Response:", response.data);
      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error);
      toast.error(error.message || "Status update failed");
    }
  };

  useEffect(() => {
    console.log("Admin Orders useEffect triggered with token:", token);
    fetchAllOrders();
  }, [token]);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Order Page
      </h3>
      <div className="max-w-4xl mx-auto space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 border border-gray-200"
            >
              <div className="flex-shrink-0">
                <img
                  src={assets.parcel_icon}
                  alt="Parcel"
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
              </div>
              <div className="flex-1 text-sm sm:text-base text-gray-700">
                <div className="mb-2">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="inline">
                      {item.name} x {item.quantity}{" "}
                      <span className="text-gray-500">({item.size})</span>
                      {idx < order.items.length - 1 ? ", " : ""}
                    </p>
                  ))}
                </div>
                <p className="font-medium">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.country},{" "}
                  {order.address.zipcode}
                </p>
                <p>{order.address.phone}</p>
              </div>
              <div className="text-sm sm:text-base text-gray-700 sm:text-right">
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-lg font-medium text-gray-800 sm:text-right">
                ${order.amount}
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="mt-2 sm:mt-0 w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="OrderPlaced">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;