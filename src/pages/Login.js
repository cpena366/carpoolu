import React, { useState } from 'react';
import { supabase } from '../supabase';

function Login() {
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
    } else {
      alert("Logged in successfully!");
      window.location.href = "/dashboard";
    }

    const { data, error2 } = await supabase.auth.getUser();
  const user = data?.user;

  if (error2 || !user) {
    console.error("Error fetching user:", error);
    alert("Error fetching user details.");
    return;
  }

  console.log("Logged-in user:", user);

  // Check if the user already exists in the Users table
  const { data: existingUser, error2: userError } = await supabase
    .from('Users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error("Error fetching user from Users table:", userError);
    alert("Error checking user in database.");
    return;
  }

  // If the user doesn't exist in the Users table, insert them
  if (!existingUser) {
    const { error2: insertError } = await supabase.from('Users').insert([{ id: user.id, email: user.email}]);

    if (insertError) {
      console.error("Error inserting user:", insertError);
      alert("Error inserting user into Users table.");
      return;
    }

    console.log("New user inserted into Users table.");
  }
  };

  return (
    <div>
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