import React, { useState } from 'react';
import { supabase } from '../supabase'; // Ensure you import your Supabase client

function PostTrip() {
  // State to store trip data
  const [tripData, setTripData] = useState({
    origin: '',
    destination: '',
    departure_time: '',
    seats_available: '',
    cost: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the logged-in user (assuming authentication is set up)
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;  // Access the user property correctly

  console.log("Fetched user data:", data); // Log the whole 'data' object
  console.log("Logged-in user:", user); // Log the user object

  // Check if the user is null or an error occurred
  if (error || !user) {
    console.error("Error fetching user:", error);
    alert("You must be logged in to post a trip.");
    return;
  }

  console.log("User ID:", user.id); // Should now correctly log the user ID
  console.log("Type of user.id:", typeof user.id); // Should log "string"

  // Proceed with trip posting if user.id exists
  if (!user.id) {
    alert("User ID is missing.");
    return;
  }


    try {
      // Convert data to match the correct types
      const newTrip = {
        driver_id: user.id, // UUID of the logged-in driver
        origin: tripData.origin.trim(),
        destination: tripData.destination.trim(),
        departure_time: new Date(tripData.departure_time).toISOString(), // Convert to timestamp
        seats_available: parseInt(tripData.seats_available, 10), // Ensure it's an integer
        cost: parseFloat(tripData.cost) // Ensure it's a number
      };

      console.log("Trip data to be inserted:", newTrip);

      // Insert into Supabase
      const { error } = await supabase.from('Trips').insert([newTrip]);

      if (error) {
        console.error("Error inserting trip:", error);
        alert("Failed to post trip.");
      } else {
        alert("Trip posted successfully!");
        setTripData({ origin: '', destination: '', departure_time: '', seats_available: '', cost: '' });
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error posting trip:", error);
    }
  };

  return (
    <div>
      <h1>Post a Trip</h1>

      {/* Trip posting form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="origin">Origin:</label>
          <input 
            type="text" 
            name="origin" 
            value={tripData.origin} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label htmlFor="destination">Destination:</label>
          <input 
            type="text" 
            name="destination" 
            value={tripData.destination} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="departure_time">Departure Time:</label>
          <input 
            type="datetime-local" 
            name="departure_time" 
            value={tripData.departure_time} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="seats_available">Seats Available:</label>
          <input 
            type="number" 
            name="seats_available" 
            value={tripData.seats_available} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="cost">Cost ($):</label>
          <input 
            type="number" 
            step="0.01" 
            name="cost" 
            value={tripData.cost} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit">Post Trip</button>
      </form>
    </div>
  );
}

export default PostTrip;