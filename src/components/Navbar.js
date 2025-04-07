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
      // Sign out via Supabase and update AuthContext
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
    };
  
    return (
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem' }}>
          <li>
            <button onClick={handleSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
              Sign Out
            </button>
          </li>
          <li>
            <Link to="/dashboard">View Trips</Link>
          </li>
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          {user.user_metadata?.isDriver && (
            <li>
              <Link to="/post-trip">Post A Trip</Link>
            </li>
          )}
          <li>
            <Link to="/bookings">My Booked Trips</Link>
          </li>
        </ul>
      </nav>
    );
  }
  
  export default Navbar;