import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      if (!token) {
        console.log("No token available");
        return;
      }

      console.log("Fetching products with token:", token);
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch full response:", response);
      console.log("Fetch response data:", response.data);

      if (response.data.success) {
        const products = response.data.products || response.data.data || [];
        console.log("Fetched products:", products);
        setList(products);
        if (products.length === 0) {
          toast.info("No products found in the database.", {
            position: "top-right",
            autoClose: 3000,
            className: "bg-blue-500 text-white rounded-md shadow-md",
          });
        }
      } else {
        toast.error(response.data.message || "Failed to fetch products", {
          position: "top-right",
          autoClose: 3000,
          className: "bg-red-500 text-white rounded-md shadow-md",
        });
      }
    } catch (error) {
      console.error("Fetch list error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch products", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-500 text-white rounded-md shadow-md",
      });
    }
  };

  const removeProduct = async (id) => {
    try {
      if (!token) {
        toast.error("No token provided. Please login.", {
          position: "top-right",
          autoClose: 3000,
          className: "bg-red-500 text-white rounded-md shadow-md",
        });
        return;
      }

      console.log("Attempting to remove product with ID:", id);
      console.log("Using token:", token);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Remove full response:", response);
      console.log("Remove response data:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Product removed successfully", {
          position: "top-right",
          autoClose: 3000,
          className: "bg-green-500 text-white rounded-md shadow-md",
        });
        await fetchList();
        console.log("List refreshed after deletion");
      } else {
        toast.error(response.data.message || "Failed to remove product", {
          position: "top-right",
          autoClose: 3000,
          className: "bg-red-500 text-white rounded-md shadow-md",
        });
      }
    } catch (error) {
      console.error(
        "Remove product error:",
        error.response?.data || error.message
      );
      // Handle HTML response gracefully
      const errorMessage = error.response?.data.includes("Cannot POST")
        ? "Delete endpoint not found on server"
        : error.response?.data?.message || "Failed to remove product";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-500 text-white rounded-md shadow-md",
      });
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with token:", token);
    if (token) {
      fetchList();
    }
  }, [token]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        All Product List
      </h2>
      <div className="flex flex-col gap-4">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-200">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>
        {list.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-lg">
            No products available.
          </p>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 border-b border-gray-200 hover:bg-gray-50 transition duration-150"
            >
              <img
                src={
                  item.image && item.image[0]
                    ? item.image[0]
                    : "placeholder.jpg"
                }
                alt={item.name || "Unnamed"}
                className="w-12 h-12 object-cover rounded-md shadow-sm"
              />
              <p className="text-gray-800 font-medium truncate">
                {item.name || "Unnamed"}
              </p>
              <p className="text-gray-600">{item.category || "N/A"}</p>
              <p className="text-gray-800 font-semibold">
                {currency}
                {item.price || "N/A"}
              </p>
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-500 hover:text-red-700 font-semibold text-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md px-2 py-1"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
