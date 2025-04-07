import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function FooterNav() {
  const location = useLocation();
  
  // Hide FooterNav on Home, Signup, and Login pages
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between">
        <Link to="/feedback" className="text-blue-500 font-semibold hover:underline">
          Feedback
        </Link>
        <Link to="/reports" className="text-blue-500 font-semibold hover:underline">
          Report a Bug
        </Link>
      </div>
    </nav>
  );
}

export default FooterNav;