import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ onLogout }) => { // Changed setToken to onLogout
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="Logo" />
      <button
        onClick={onLogout} // Use onLogout prop
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;