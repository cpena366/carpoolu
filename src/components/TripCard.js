import React, { useState } from 'react';
import { supabase } from '../supabase';

function TripCard({ trip, userId, joinedTripIds }) {


  // Ensure the trip ID is compared as a string
  const [isJoined, setIsJoined] = useState(joinedTripIds.has(String(trip.id)));

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const dt = new Date(dateString);
    return dt.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format the departure time nicely
  const formattedDepartureTime = formatDateTime(trip.departure_time);
  // Format the created_at date (posted date)
  const formattedCreatedAt = formatDateTime(trip.created_at);

  // Calculate remaining seats from bookings. Ensure trip.bookings is an array.
  const bookingsCount = Array.isArray(trip.bookings) ? trip.bookings.length : 0;
  const seatsLeft = trip.seats_available - bookingsCount;

  // If no seats are available, do not render this TripCard
  if (seatsLeft <= 0) return null;

  const departureTime = new Date(trip.departure_time);
const hasDeparted = departureTime <= new Date();

  const handleJoinTrip = async () => {
    if (!userId) {
      alert('You must be logged in to join a trip.');
      return;
    }
    if (isJoined) {
      alert('You have already joined this trip.');
      return;
    }
    // Insert booking record
    const { error } = await supabase.from('Bookings').insert([{ 
      user_id: userId, 
      trip_id: trip.id 
    }]);

    if (error) {
      console.error('Error joining trip:', error);
      alert('Error joining trip. Please try again.');
    } else {
      setIsJoined(true);
    }
  };

  return (
    <div className="bg-white shadow rounded border border-gray-300 p-4 my-4">
      <h3 className="text-2xl font-bold mb-0.5">
        Going to: {trip.destination}
      </h3>
      <p className="text-lg text-gray-700 mb-3">
        Meeting at: {trip.origin}
      </p>
      <p className="text-red-900 mb-0.5">
        <strong>Leaving At:</strong> {formattedDepartureTime}
      </p>
      {trip.trip_description && (
        <p className="text-gray-700 mb-0.5">
          <strong>Description:</strong> {trip.trip_description}
        </p>
      )}
      <p className="text-gray-700 mb-0.5">
        <strong>Seats Available:</strong> {seatsLeft}
      </p>
      <p className="text-gray-700 mb-0.5">
        <strong>Cost:</strong> FREE
      </p>
      <p className="text-gray-500 text-xs mb-2">
        <strong>Posted on:</strong> {formattedCreatedAt}
      </p>
      <button
        onClick={handleJoinTrip}
        disabled={isJoined || hasDeparted}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {hasDeparted ? 'Departed' : (isJoined ? 'Joined' : 'Join Trip')}
      </button>
    </div>
  );
}

export default TripCard;