import React from 'react';
import { supabase } from '../supabase';

function TripCard({ trip, userId }) {
  const handleJoinTrip = async () => {
    if (!userId) {
      alert('You must be logged in to join a trip.');
      return;
    }

    const { error } = await supabase.from('Bookings').insert([
      {
        user_id: userId,
        trip_id: trip.id
      }
    ]);

    if (error) {
      console.error("Error joining trip:", error);
      alert("Failed to join trip.");
    } else {
      alert("Successfully joined trip!");
    }
  };

  return (
    <div>
      <h3>{trip.destination}</h3>
      <p>Departure: {new Date(trip.departure_time).toLocaleString()}</p>
      <p>Seats Available: {trip.seats_available}</p>
      <button onClick={handleJoinTrip}>Join Trip</button>
    </div>
  );
}

export default TripCard;