import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";

// Define constants for export
export const backendUrl = "http://localhost:4000"; // Backend URL
export const currency = "$"; // Currency symbol (adjust as needed)

const App = () => {
  const [token, setToken] = useState("");

  // Reset token on refresh
  useEffect(() => {
    setToken("");
  }, []);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("savedEmail");
    localStorage.removeItem("savedPassword");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {token ? (
        <>
          <Navbar onLogout={handleLogout} />
          <hr />
          <div className="flex w-full">
            <SideBar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
};

export default App;