import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function PostTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    origin: '',
    destination: '',
    departure_time: new Date(), // use a Date object
    seats_available: '',
    trip_description: ''
  });

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setTripData({ ...tripData, departure_time: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to post a trip.");
      return;
    }

    const newTrip = {
      driver_id: user.id,
      origin: tripData.origin.trim(),
      destination: tripData.destination.trim(),
      departure_time: tripData.departure_time.toISOString(), // Convert to ISO string
      seats_available: parseInt(tripData.seats_available, 10),
      trip_description: tripData.trip_description.trim(),
      cost: 0
    };

    const { error } = await supabase.from('Trips').insert([newTrip]);

    if (error) {
      console.error("Error inserting trip:", error);
      alert("Failed to post trip.");
    } else {
      alert("Trip posted successfully!");
      setTripData({ origin: '', destination: '', departure_time: new Date(), seats_available: '', trip_description: '' });
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h1>Post a Trip</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="origin">Leaving From:</label>
          <select 
            name="origin" 
            value={tripData.origin} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Origin</option>
            <option value="Lot G (Lower Lot - Hamill Center/Security)">Lot G (Lower Lot - Hamill Center/Security)</option>
            <option value="Lot G (Lower Lot - Fishbowl)">Lot G (Lower Lot - Fishbowl)</option>
            <option value="Lot F2 (Armand Hammer Alumni-Student Center)">Lot F2 (Armand Hammer Alumni-Student Center)</option>
            <option value="Lot H (Upper Lot - Bus Booth)">Lot H (Upper Lot - Bus Booth)</option>
            <option value="Lot J1 (J.D. McKean Library)">Lot J1 (J.D. McKean Library)</option>
            <option value="Lot J2 (Media Arts Center)">Lot J2 (Media Arts Center)</option>
            <option value="Lot A (Mabee Center)">Lot A (Mabee Center)</option>
            <option value="Lot E (Kenneth H. Cooper Aerobics Center)">Lot E (Kenneth H. Cooper Aerobics Center)</option>
          </select>
        </div>

        <div>
          <label htmlFor="destination">Going To:</label>
          <textarea 
            type="text" 
            name="destination" 
            value={tripData.destination} 
            onChange={handleChange} 
            placeholder="e.g. Walmart, Target, Social Security Office" 
            required 
          />
        </div>

        <div>
          <label htmlFor="trip_description">Trip Description:</label>
          <textarea 
            name="trip_description" 
            value={tripData.trip_description} 
            onChange={handleChange} 
            placeholder="Enter any trip details that might be important." 
            required
          />
        </div>
        
        <div>
          <label htmlFor="departure_time">Departure Time:</label>
          <DatePicker
            selected={tripData.departure_time}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="hh:mm aa"
            timeIntervals={15}
            dateFormat="EEEE, MMMM d 'at' hh:mm aa"
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
            min="1"
            max="11"
          />
        </div>
        
        <button type="submit">Post Trip</button>
      </form>
    </div>
  );
}

export default PostTrip;