import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";

export const backendUrl = "http://localhost:4000";
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    // --- Added Debug: Log initial token ---
    console.log("App useEffect - Initial token:", token);
  }, []); // Empty dependency array to run only on mount

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("savedEmail");
    localStorage.removeItem("savedPassword");
    console.log("Logged out, token cleared");
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
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
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