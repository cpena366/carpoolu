import React, { useState } from 'react';
import { supabase } from '../supabase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isDriver, setIsDriver] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm signup!");
    }

    const user = data?.user;
    
    if (!user) {
      alert("Signup successful, but user data is unavailable. Check email for verification.");
      return;
    }

    console.log("New user signed up:", user);

    // Step 2: Insert the user into the Users2 table
    const { error: insertError } = await supabase.from('Users2').insert([
        {
          id: user.id,  // Use the Supabase user ID
          name: name,  // Store user-provided name
          email: email, // Store email
          is_driver: isDriver, // Boolean value
          created_at: new Date().toISOString() // Timestamp
        }
      ]);

    if (insertError) {
      console.error("Error inserting user into Users2 table:", insertError);
      alert("Error inserting user into Users2 table. Please try again.");
      return;
    }

    alert("Signup successful! Check your email to confirm your account.");
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>
          <input type="checkbox" checked={isDriver} onChange={(e) => setIsDriver(e.target.checked)} />
          Register as Driver
        </label>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;