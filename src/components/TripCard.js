import React from 'react';
import { supabase } from '../supabase';

function TripCard({ trip, userId }) {
  const handleJoinTrip = async () => {
    const [isJoined, setIsJoined] = useState(joinedTripIds.has(trip.id));

    if (!userId) {
      alert('You must be logged in to join a trip.');
      return;
    }

    const handleJoinTrip = async () => {
      if (isJoined) {
        alert('You have already joined this trip.');
        return;
      }

    // Insert booking record
    const { error } = await supabase
      .from('Bookings')
      .insert([{ user_id: userId, trip_id: trip.id }]);

    if (error) {
      console.error('Error joining trip:', error);
    } else {
      setIsJoined(true);
    }
  };

    if (error) {
      console.error("Error joining trip:", error);
      alert("Failed to join trip.");
    } else {
      alert("Successfully joined trip!");
    }
  };

  return (
    <div className="trip-card">
      <h3>{trip.destination}</h3>
      <p>Driver: {trip.driver_name}</p>
      <button onClick={handleJoinTrip} disabled={isJoined}>
        {isJoined ? 'Joined' : 'Join Trip'}
      </button>
    </div>
  );
}

export default TripCard;