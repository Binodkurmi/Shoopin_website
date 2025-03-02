import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const [images, setImages] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [index]: file }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      Object.keys(images).forEach((key) => {
        formData.append(`image${parseInt(key) + 1}`, images[key]);
      });

      // Debug FormData contents
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const token = localStorage.getItem("token");
      console.log("Token sent:", token); // Debug token
      if (!token) {
        toast.error("🚨 No token found. Please login again.");
        return;
      }

      console.log("Sending request to:", `${backendUrl}/api/product/add`); // Debug URL
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Server response:", response.data); // Debug response
      if (response.data.success) {
        setImages({});
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setBestseller(false);
        setSizes([]);
        toast.success("🎉 Product added successfully!");
      } else {
        toast.error(`❌ Failed to add product: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message); // Debug full error
      toast.error(`⚠️ Submission error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-md space-y-6"
      >
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Upload Image</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center items-center cursor-pointer hover:bg-gray-100 transition"
              >
                {images[index] ? (
                  <img
                    className="w-16 h-16 object-cover"
                    src={URL.createObjectURL(images[index])}
                    alt={`Uploaded ${index + 1}`}
                  />
                ) : (
                  <img className="w-16 h-16 object-cover" src={assets.upload_area} alt="Upload" />
                )}
                <input
                  onChange={(e) => handleImageChange(e, index)}
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Product Name</p>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
            placeholder="Type name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Product Description</p>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Write content here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Product Category</p>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Sub Category</p>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="Topwear">Top Wear</option>
              <option value="Bottomwear">Bottom Wear</option>
              <option value="Winterwear">Winter Wear</option>
            </select>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Product Price</p>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Product Sizes</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <div
                key={s}
                className={`px-4 py-2 border border-gray-300 rounded-md text-center font-medium cursor-pointer transition duration-300 
                ${sizes.includes(s) ? "bg-gray-500 text-white border-gray-500" : "text-gray-600 hover:bg-gray-500 hover:text-white"}`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
                  )
                }
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-600 transition duration-300"
          >
            Add Product
          </button>
        </div>
      </form>
    </>
  );
};

export default Add;