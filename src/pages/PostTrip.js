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

    // Validate that the departure time is in the future
    if (tripData.departure_time.getTime() <= new Date().getTime()) {
        alert("Departure time must be in the future.");
        return;
      }

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a Trip</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="origin" className="block text-gray-700 font-bold mb-2">
            Leaving From:
          </label>
          <select
            name="origin"
            value={tripData.origin}
            onChange={handleChange}
            required
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
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

        <div className="mb-4">
          <label htmlFor="destination" className="block text-gray-700 font-bold mb-2">
            Going To:
          </label>
          <textarea
            name="destination"
            value={tripData.destination}
            onChange={handleChange}
            placeholder="e.g. Walmart, Target, Social Security Office"
            required
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="trip_description" className="block text-gray-700 font-bold mb-2">
            Trip Description:
          </label>
          <textarea
            name="trip_description"
            value={tripData.trip_description}
            onChange={handleChange}
            placeholder="Enter any trip details that might be important."
            required
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="departure_time" className="block text-gray-700 font-bold mb-2">
            Departure Time:
          </label>
          <DatePicker
            selected={tripData.departure_time}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="hh:mm aa"
            timeIntervals={15}
            dateFormat="EEEE, MMMM d 'at' hh:mm aa"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="seats_available" className="block text-gray-700 font-bold mb-2">
            Seats Available:
          </label>
          <input
            type="number"
            name="seats_available"
            value={tripData.seats_available}
            onChange={handleChange}
            required
            min="1"
            max="11"
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Post Trip
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostTrip;