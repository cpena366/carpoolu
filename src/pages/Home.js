import React from 'react';
import { Link } from 'react-router-dom';

// Example: A simple component using Tailwind CSS
function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img
  src="/logo192.png"
  alt="App Logo"
  className="w-64 h-64 mb-4"
/>
      <h1 className="text-3xl md:text-4xl font-bold mb-3">CarpoolU</h1>
      <p className="text-lg text-gray-700">Drive. Ride. Connect. Campus Made Simple.
      </p>
      <div className="mt-4">
        <a href="/signup" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Sign Up
        </a>
        <a href="/login" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Login
        </a>
      </div>
    </div>
  );
}
export default Home;