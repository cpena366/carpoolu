import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
  
    // Hide Navbar on Home, Login, or Signup pages
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') return null;
  
    if (!user) return null;
  
    const handleSignOut = async () => {
      if (!window.confirm("Are you sure you want to sign out?")) return;
      // Sign out via Supabase and update AuthContext
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
    };

    // Helper function to determine active class for links
  const getLinkClasses = (path) => {
    const baseClasses = "px-4 py-2 rounded transition-colors duration-200";
    const activeClasses = "bg-blue-500 text-white font-bold";
    const inactiveClasses = "text-gray-700 hover:bg-gray-200";
    return location.pathname === path ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex justify-around items-center space-x-4 py-4">
          <li>
            <button
              onClick={handleSignOut}
              className="font-bold text-xl text-black hover:underline transition-colors"
            >
              &larr; Sign Out
            </button>
          </li>
          <li>
            <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className={getLinkClasses("/profile")}>
              Profile
            </Link>
          </li>
          {user.user_metadata?.isDriver && (
            <li>
              <Link to="/post-trip" className={getLinkClasses("/post-trip")}>
                Post A Trip
              </Link>
            </li>
          )}
          <li>
            <Link to="/bookings" className={getLinkClasses("/bookings")}>
              My Booked Trips
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
  }
  
  export default Navbar;