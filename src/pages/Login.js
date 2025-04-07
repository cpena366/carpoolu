import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    
    const { data, error: getUserError } = await supabase.auth.getUser();
    const user = data?.user;

    if (getUserError || !user) {
      console.error("Error fetching user:", getUserError);
      alert("Error fetching user details.");
      return;
    }

    console.log("Logged-in user:", user);

    // Check if the user already exists in the Users2 table using either id or email
    const { data: existingUser, error: userError } = await supabase
      .from('Users2')
      .select('id')
      .or(`id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user from Users2 table:", userError);
      alert("Error checking user in database.");
      return;
    }

    // If the user doesn't exist in the Users2 table, try inserting them
    if (!existingUser) {
      const { error } = await supabase.from('Users2').insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0],
        is_driver: user.user_metadata?.isDriver ?? false,
        car_color: user.user_metadata?.car_color || null,
        car_brand: user.user_metadata?.car_brand || null,
        car_make: user.user_metadata?.car_make || null
      }, { returning: 'minimal' });
      
      if (error) {
        // If the error is a duplicate key error, ignore it
        if (error.code === '23505') {
          console.log("Duplicate key error: user already exists, ignoring insert.");
        } else {
          console.error("Error inserting user:", error);
          alert("Error inserting user into Users2 table.");
          return;
        }
      } else {
        console.log("User inserted into Users2 table.");
      }
    }

    alert("Logged in successfully!");
    // Update the global AuthContext with the latest user object
    setUser(user);
    navigate("/dashboard");
  };

  return (
    <div>
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>
        &larr; Back
      </button>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;