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
        toast.error("No token provided. Please login.");
        console.log("No token available");
        return;
      }

      console.log("Fetching products with token:", token); // Debug token
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Raw API response:", response); // Debug full response
      console.log("Response data:", response.data); // Debug response.data

      if (response.data.success) {
        const products = response.data.products || response.data.data || [];
        console.log("Processed products:", products); // Debug final products
        setList(products);
        if (products.length === 0) {
          toast.info("No products found in the database.");
        }
      } else {
        toast.error(response.data.message || "Failed to fetch products");
        console.log("API error message:", response.data.message);
      }
    } catch (error) {
      console.error("Fetch list error:", error.response || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

  const removeProduct = async (id) => {
    try {
      if (!token) {
        toast.error("No token provided. Please login.");
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Remove response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message || "Product removed successfully");
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Remove product error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to remove product");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with token:", token); // Debug token on mount
    if (token) {
      fetchList();
    } else {
      toast.error("Please login to view the product list.");
    }
  }, [token]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <p className="mb-2 text-lg font-semibold">All Product List</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-medium">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {list.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No products available.</p>
        ) : (
          list.map((item) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
              key={item._id}
            >
              <img
                src={item.image && item.image[0] ? item.image[0] : "placeholder.jpg"}
                alt={item.name || "Unnamed"}
                className="w-12 h-12 object-cover"
              />
              <p>{item.name || "Unnamed"}</p>
              <p>{item.category || "N/A"}</p>
              <p>{currency}{item.price || "N/A"}</p>
              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg text-red-500 hover:text-red-700"
              >
                X
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default List;