import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Carpool App</h1>
      <p>Find or post a ride with fellow students!</p>
      <nav>
        <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}

export default Home;