import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import TripCard from '../components/TripCard';

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [joinedTripIds, setJoinedTripIds] = useState(new Set());

  useEffect(() => {
    const fetchTrips = async () => {
      // Fetch all trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('Trips')
        .select('*');

      if (tripsError) {
        console.error('Error fetching trips:', tripsError);
        return;
      }

      // Fetch trips the user has joined
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('Bookings')
        .select('trip_id')
        .eq('user_id', userId);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return;
      }

      // Extract trip IDs the user has joined
      const joinedTripIdsSet = new Set(bookingsData.map((booking) => booking.trip_id));
      setJoinedTripIds(joinedTripIdsSet);

      // Filter out trips that the user has already joined
      const availableTrips = tripsData.filter((trip) => !joinedTripIdsSet.has(trip.id));
      setTrips(availableTrips);
    };

    if (userId) {
      fetchTrips();
    }
  }, [userId]);

  return (
    <div>
      <nav>
        <Link to="/">Sign Out</Link>
      </nav>

      <h1>Dashboard</h1>

      <Link to="/post-trip">
        <button>Post a Trip</button>
      </Link>

      <h2>Available Trips</h2>
      {trips.length > 0 ? (
        trips.map((trip) => <TripCard key={trip.id} trip={trip} userId={userId} joinedTripIds={joinedTripIds} />)
      ) : (
        <p>No trips available.</p>
      )}
    </div>
  );
}

export default Dashboard;