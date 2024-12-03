import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Todo App
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:bg-blue-500 px-3 py-2 rounded">
            Home
          </a>
          <a href="#" className="text-white hover:bg-blue-500 px-3 py-2 rounded">
            About
          </a>
          <a href="#" className="text-white hover:bg-blue-500 px-3 py-2 rounded">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
