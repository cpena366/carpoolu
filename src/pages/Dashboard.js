import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import TripCard from '../components/TripCard';

function Dashboard() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  {/*// Redirect to login if no user is authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);*/}

  const [trips, setTrips] = useState([]);
  const [joinedTripIds, setJoinedTripIds] = useState(new Set());

  useEffect(() => {
    const fetchTrips = async () => {
      // Fetch all trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('Trips')
        .select('*, bookings:Bookings_trip_id_fkey(*)');

      if (tripsError) {
        console.error('Error fetching trips:', tripsError);
        return;
      }

      if (userId) {
        // Fetch trips the user has joined
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('Bookings')
          .select('trip_id')
          .eq('user_id', userId);

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          return;
        }

        // Extract trip IDs the user has joined (as strings)
        const joinedTripIdsSet = new Set(bookingsData.map((booking) => String(booking.trip_id)));
        setJoinedTripIds(joinedTripIdsSet);

        // Filter out trips that the user has already joined, trips posted by the user,
// and trips whose departure time has already passed.
const availableTrips = tripsData.filter((trip) => {
  const departureTime = new Date(trip.departure_time);
  return departureTime > new Date() &&
         !joinedTripIdsSet.has(String(trip.id)) &&
         String(trip.driver_id) !== String(userId);
});
        setTrips(availableTrips);
      } else {
        // If no userId is provided, just set all trips
        setTrips(tripsData);
      }
    };

    fetchTrips();
    const intervalId = setInterval(() => {
      fetchTrips();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Available Trips
      </h2>
      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              userId={userId}
              joinedTripIds={joinedTripIds}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No active trips.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;